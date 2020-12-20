interface SeasonStats {
  team: string;
  passingYards: number;
  rushingYards: number;
  allowedPassingYards: number;
  allowedRushingYards: number;
}

interface SeasonLeagueStats {
  teams: Map<string, SeasonStats>;
  totals: SeasonStats;
}

interface StatsProvider {
  fetchData: () => Promise<void>;
  getSeasonStats: () => SeasonLeagueStats;
}
