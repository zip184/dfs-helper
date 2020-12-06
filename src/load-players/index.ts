import parseCsvFile from "./read-csv-parser";
// import parseCsvFile from "./read-fs";
import { mapPlayer } from "../../dfs-helper.config";

export const readPlayersCsv = async (file: string): Promise<Player[]> => {
  const data: any[] = await parseCsvFile(file);

  // Check for header row
  if (data && data.length > 0 && data[0].position === "Position") {
    data.shift();
  }

  // Map player data to Player type
  return data.map(mapPlayer);
};
