import {
  findAllCombinations,
  calcCombinationsCount,
  colorOutputText,
  numberWithCommas,
} from "../utils";
import { getPassingLineups } from "./lineup-validator";

const updateProgressPeriod = 10000;
const outputStream = process.stdout;

export const populateLineup = (players: Player[]): Lineup =>
  <Lineup>{
    players,
    score: players.reduce<number>(
      (totalScore, player) => totalScore + player.avgPoints,
      0
    ),
    salary: players.reduce<number>(
      (totalSalary, player) => totalSalary + player.salary,
      0
    ),
  };

const getAllLineups = (contest: Contest, players: Player[]) => {
  const loadingMsg = "Finding all possible player combinations ";
  const cursorPos = loadingMsg.length;
  outputStream.write(loadingMsg);
  const contestPlayerCount = contest.playerCount;

  let progress = 0;
  let updateCount = 0;
  const comboCount = calcCombinationsCount(players, contestPlayerCount);

  const allCombos = findAllCombinations(players, contestPlayerCount, (n) => {
    if (updateCount % updateProgressPeriod === 0) {
      const pctComplete = Math.floor((progress / comboCount) * 100);
      outputStream.cursorTo(cursorPos);
      outputStream.write(colorOutputText(`${pctComplete} %`, "magenta"));
    }
    updateCount++;
    progress += n;
  });

  outputStream.cursorTo(cursorPos);
  outputStream.write(
    colorOutputText(
      `found ${numberWithCommas(allCombos.length)} combinations\n`,
      "green"
    )
  );

  return allCombos.map(populateLineup);
};

export const generateAllValidLineups = (
  contest: Contest,
  players: Player[]
) => {
  const allLineups = getAllLineups(contest, players);

  const validLineups = getPassingLineups(contest, allLineups);

  return Promise.resolve(validLineups);
};
