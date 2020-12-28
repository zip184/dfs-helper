import parseCsvFile from "./read-csv-parser";
// import parseCsvFile from "./read-fs";
import { mapPlayer } from "../../dfs-helper.config";

// Team example 'DET@TEN 12/20/2020 01:00PM ET'
const parseGameData = (player: Player) => {
  const { team, game, name } = player;

  try {
    const teamsAt = game.split(" ")[0].split("@");

    if (team === teamsAt[0]) {
      player.opposingTeam = teamsAt[1];
      player.isHome = false;
    } else if (team === teamsAt[1]) {
      player.opposingTeam = teamsAt[0];
      player.isHome = true;
    } else {
      // Player's team isn't either team
      throw new Error();
    }
  } catch {
    new Error(`Error parsing game: '${game}' for player ${name}`);
  }
};

const populateExtraData = (player: Player) => {
  parseGameData(player);
};

export const readPlayersCsv = async (file: string): Promise<Player[]> => {
  const data: any[] = await parseCsvFile(file);

  // Check for header row
  if (data && data.length > 0 && data[0].position === "Position") {
    data.shift();
  }

  // Map player data to Player type
  const players = data.map(mapPlayer);

  // Populate extra data
  players.forEach(populateExtraData);

  return players;
};
