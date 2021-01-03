import { getSeasonStatsSync } from "../stats-service";
import { statsRankerOppFactorExponent } from "../../dfs-helper.config";

const oppFactorCache = new Map<number, number>();

const rushDefensePositions = new Set(["RB"]);
const passDefensePositions = new Set(["QB", "WR", "TE"]);
const defensePositions = new Set(["DST"]);

// Return a factor > 1.0 for bad defenses, and < 1.0 for good defenses
const calcOpponentFactor = (player: Player, leagueStats: SeasonLeagueStats) => {
  const { position, opposingTeam } = player;

  const teamSeasonStats = leagueStats.teams.get(opposingTeam);
  if (!teamSeasonStats) {
    throw new Error(`Team: '${opposingTeam}' not found in stat provider data`);
  }

  let totalLeagueYards;
  let oppTeamYards = 1;

  if (rushDefensePositions.has(position)) {
    oppTeamYards = teamSeasonStats.allowedRushingYards;
    totalLeagueYards = leagueStats.totals.allowedRushingYards;
  } else if (passDefensePositions.has(position)) {
    oppTeamYards = teamSeasonStats.allowedPassingYards;
    totalLeagueYards = leagueStats.totals.allowedPassingYards;
  } else if (defensePositions.has(position)) {
    oppTeamYards =
      teamSeasonStats.allowedRushingYards + teamSeasonStats.allowedPassingYards;
    totalLeagueYards =
      leagueStats.totals.allowedRushingYards +
      leagueStats.totals.allowedPassingYards;
  } else {
    // Unknown position, return 1
    return 1.0;
  }

  const teamCount = leagueStats.teams.size;
  const avgLeagueYards = totalLeagueYards / teamCount;

  // Calculate factor
  let oppFactor = oppTeamYards / avgLeagueYards;

  oppFactor = Math.pow(oppFactor, statsRankerOppFactorExponent);

  return oppFactor;
};

const statsRanker: LineupScorrer = (lineup: Lineup) => {
  const seasonStats = getSeasonStatsSync();

  return lineup.players.reduce((total: number, player: Player) => {
    let oppFactor = oppFactorCache.get(player.playerId);

    if (!oppFactor) {
      oppFactor = calcOpponentFactor(player, seasonStats);
      console.log(player.name + ": " + oppFactor.toFixed(3));
      oppFactorCache.set(player.playerId, oppFactor);
    }

    let { multiplier } = player;
    if (multiplier === 0) {
      multiplier = 1.0;
    }

    // TODO do isHome too
    return total + player.avgPoints * multiplier * oppFactor;
  }, 0);
};

export default statsRanker;
