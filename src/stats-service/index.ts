import { NflDotComStatsProvider as CurrentStatsProvider } from "./nfl-dot-com-scraper";

export const getSeasonStats = async (
  year: number
): Promise<SeasonLeagueStats> => {
  const provider: StatsProvider = new CurrentStatsProvider(year);

  await provider.fetchData();

  return provider.getSeasonStats();
};
