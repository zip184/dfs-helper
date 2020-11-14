const config = require("../../dfs-helper.config");

const {
  minSalaryThresholdPct: minSalaryPctConfig,
  maxRemainingSalaryThreshold: maxRemainingSalaryConfig,
} = config;

const totalLineupSalary = (lineup) =>
  lineup.reduce((total, { salary }) => total + +salary, 0);

const fitsMinSalaryPct = (
  contest,
  lineup,
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

const underMaxRemainingSalary = (
  contest,
  lineup,
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

const fitsSalaryCap = (contest, lineup) => {
  const { maxSalary } = contest;

  const totalSalary = lineup.reduce((total, { salary }) => total + +salary, 0);

  return totalSalary <= maxSalary;
};

const getPlayerPositions = ({ rosterPositions }) => rosterPositions.split("/");

const correctPositionCounts = (
  contest,
  lineup,
  skippedAssignmentSet = new Set()
) => {
  const { roster, playerCount } = contest;

  if (playerCount === 0 && lineup.length === 0) {
    // Empty lineup is correct for no positions
    return true;
  }

  if (playerCount !== lineup.length) {
    // Too little or too many players, fails
    return false;
  }

  const pickedPositions = {};
  let pickedCount = 0;
  let lastHashToSkip = null;

  for (let lineupIndex = 0; lineupIndex < lineup.length; lineupIndex++) {
    const player = lineup[lineupIndex];
    const positions = getPlayerPositions(player);
    let pickedPos = null;

    for (let posIndex = 0; posIndex < positions.length; posIndex++) {
      const pos = positions[posIndex];

      const rosterCount = roster[pos] || 0;
      const curPosCount = pickedPositions[pos] || 0;

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
        pickedPositions[pos] = curPosCount + 1;
        pickedCount++;

        if (pickedCount === playerCount) {
          // We've found a valid lineup configuration!
          return true;
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
    return false;
  }

  // There's more configurations to try
  skippedAssignmentSet.add(lastHashToSkip);
  return correctPositionCounts(contest, lineup, skippedAssignmentSet);
};

module.exports = {
  allRules: [
    {
      ruleFunction: fitsSalaryCap,
      title: "Doesn't Exceed Salary Cap",
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
      ruleFunction: correctPositionCounts,
      title: "Has Correct Position Counts",
      isDkValidationRule: true,
    },
  ],
  correctPositionCounts,
  fitsSalaryCap,
  fitsMinSalaryPct,
  underMaxRemainingSalary,
};
