import { NflDotComStatsProvider as CurrentStatsProvider } from "./nfl-dot-com-scraper";
import { contestYear } from "../../dfs-helper.config";

// Undefined means we haven't fetched - null means error or waiting for response
let provider: StatsProvider | undefined | null = undefined;

export const getSeasonStats = async (
  year: number = contestYear
): Promise<SeasonLeagueStats> => {
  if (provider === undefined) {
    provider = new CurrentStatsProvider(year);
    await provider.fetchData();
  }

  if (provider === null) {
    throw new Error("Fetched stats while awaiting response");
  }

  return provider.getSeasonStats();
};

export const fetchStats = async (year: number = contestYear) => {
  provider = new CurrentStatsProvider(year);
  await provider.fetchData();
};

export const getSeasonStatsSync = () => {
  if (provider === null) {
    throw new Error("Fetched stats while awaiting response");
  } else if (provider === undefined) {
    throw new Error("Fetched stats synchronously without fetching first");
  }

  return provider.getSeasonStats();
};
