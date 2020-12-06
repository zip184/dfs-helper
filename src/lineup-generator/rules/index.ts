import {
  minSalaryThresholdPct as minSalaryPctConfig,
  maxRemainingSalaryThreshold as maxRemainingSalaryConfig,
  requiredPlayers as requiredPlayersConfig,
} from "../../../dfs-helper.config";
import {
  getRosterPositionsCache,
  setRosterPositionsCache,
} from "../../cache-db";

const totalLineupSalary = (lineup: Player[]) =>
  lineup.reduce((total: number, player: Player) => total + +player.salary, 0);

export const fitsMinSalaryPct = (
  contest: Contest,
  lineup: Player[],
  minSalaryPct = minSalaryPctConfig // Param just for testing
) => {
  if (!minSalaryPct || minSalaryPct <= 0) {
    // Rule is disabled, so always pass
    return true;
  }

  const { maxSalary } = contest;
  const totalSalary = totalLineupSalary(lineup);

  return totalSalary / maxSalary >= minSalaryPct;
};

export const underMaxRemainingSalary = (
  contest: Contest,
  lineup: Player[],
  maxRemainingSalary = maxRemainingSalaryConfig // Param just for testing
) => {
  if (!maxRemainingSalary || maxRemainingSalary <= 0) {
    // Rule is disabled, so always pass
    return true;
  }

  const { maxSalary } = contest;
  const totalSalary = totalLineupSalary(lineup);

  return maxSalary - totalSalary <= maxRemainingSalary;
};

export const fitsSalaryCap = (contest: Contest, lineup: Player[]) => {
  const { maxSalary } = contest;

  const totalSalary = lineup.reduce((total, { salary }) => total + +salary, 0);

  return totalSalary <= maxSalary;
};

export const correctPositionCounts = (
  contest: Contest,
  lineup: Player[],
  skippedAssignmentSet = new Set()
): Map<number, string> | null => {
  const { roster, playerCount } = contest;
  const playerPositions = new Map<number, string>();

  if (playerCount === 0 && lineup.length === 0) {
    // Empty lineup is correct for no positions
    return playerPositions;
  }

  if (playerCount !== lineup.length) {
    // Too little or too many players, fails
    return null;
  }

  const pickedPositionCounts = new Map<string, number>();
  let pickedCount = 0;
  let lastHashToSkip = null;

  for (let lineupIndex = 0; lineupIndex < lineup.length; lineupIndex++) {
    const player = lineup[lineupIndex];
    const positions = player.rosterPositions;
    let pickedPos = null;

    for (let posIndex = 0; posIndex < positions.length; posIndex++) {
      const pos = positions[posIndex];

      const rosterCount = roster.get(pos) || 0;
      const curPosCount = pickedPositionCounts.get(pos) || 0;

      // Check if the position is open
      if (rosterCount - curPosCount > 0) {
        // Check if they're more positions after this one
        if (posIndex < positions.length - 1) {
          const posPlayerHash = `${player.playerId}|${pos}`;

          // Check if we've tried this yet
          if (skippedAssignmentSet.has(posPlayerHash)) {
            // We've already tried this configuration, so lets look for another position we haven't tried
            continue;
          }
          lastHashToSkip = posPlayerHash;
        }

        pickedPos = pos;
        playerPositions.set(player.playerId, pos);
        pickedPositionCounts.set(pos, curPosCount + 1);
        pickedCount++;

        if (pickedCount === playerCount) {
          // We've found a valid lineup configuration!
          return playerPositions;
        }

        // We've chosen this position, move into the next player
        break;
      }
    }

    if (!pickedPos) {
      // This player couldn't find a position, exit this configuration attempt
      break;
    }
  }

  // We did not find valid configuration
  if (!lastHashToSkip) {
    // We know there were no more optional positions to try so we know this lineup failed
    return null;
  }

  // There's more configurations to try
  skippedAssignmentSet.add(lastHashToSkip);
  return correctPositionCounts(contest, lineup, skippedAssignmentSet);
};

export const hasTwoDifferentGames = (_: Contest, lineup: Player[]) => {
  const gameSet = new Set();
  lineup.forEach((player: Player) => gameSet.add(player.game));
  return gameSet.size >= 2;
};

export const hasRequiredPlayers = (_: any, lineup: Player[]) => {
  const lineupNameSet = new Set();
  lineup.forEach(({ name }) => lineupNameSet.add(name));

  return requiredPlayersConfig.every((name) => lineupNameSet.has(name));
};

const withLineupCacheCheck = (ruleFunction: RuleFunction) => (
  contest: Contest,
  lineup: Player[]
) => {
  // Check cache first
  const cache = getRosterPositionsCache();
  const serialized = JSON.stringify(lineup.map(({ playerId }) => playerId));
  const cachedValue = cache[serialized];
  if (cachedValue !== undefined) {
    // Cache hit, return true/false
    return cachedValue;
  }

  const hasCorrect = ruleFunction(contest, lineup);

  // Save value in cache
  cache[serialized] = hasCorrect;
  setRosterPositionsCache(cache);

  return hasCorrect;
};

export const allRules: LineupRule[] = [
  {
    ruleFunction: fitsSalaryCap,
    title: "Doesn't Exceed Salary Cap",
    isDkValidationRule: true,
  },
  {
    ruleFunction: hasTwoDifferentGames,
    title: "At Least Two Games",
    isDkValidationRule: true,
  },
  {
    ruleFunction: fitsMinSalaryPct,
    title: "Salary Meets Minimum Salary Threshold",
    isDkValidationRule: false,
  },
  {
    ruleFunction: underMaxRemainingSalary,
    title: "Is Below Remaining Salary Limit",
    isDkValidationRule: false,
  },
  {
    ruleFunction: withLineupCacheCheck(correctPositionCounts),
    title: "Has Correct Position Counts",
    isDkValidationRule: true,
    usesCacheDb: true,
  },
  {
    ruleFunction: hasRequiredPlayers,
    title: "Contains all required players",
    isDkValidationRule: false,
  },
];
