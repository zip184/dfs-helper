/* eslint-disable no-console */
import { readPlayersCsv } from "../load-players";
import { generateAllValidLineups } from "../lineup-generator";
import { contest } from "../../dfs-helper.config";
import { findTopNLineups } from "../lineup-ranker";
import { numberWithCommas } from "../utils";

const printIds = (label: string, players: Player[]) =>
  console.log(
    label,
    players.map((p) => `${p.position} ${p.name} ${p.salary}`)
  );

const main = async () => {
  const cliArgs = process.argv.slice(2);
  const fileName = cliArgs[0];
  if (!fileName) {
    console.log("Error: Missing file name");
    return;
  }

  const players = await readPlayersCsv(fileName);

  // printIds("players", players);
  // console.log(players);

  const allLineups = await generateAllValidLineups(contest, players);

  console.log(
    `Total valid lineups found: ${numberWithCommas(allLineups.length)}`
  );

  const topLineups = findTopNLineups(contest, allLineups, 4);

  topLineups.forEach((lineup: Lineup, i: number) => {
    const { score, players, salary, avgPoints } = lineup;

    printIds(
      `lineup rank #${
        i + 1
      } score: ${score} salary: ${salary} avgPoints: ${avgPoints.toFixed(2)}`,
      players.sort((a: Player, b: Player) => b.salary - a.salary)
    );
  });
};

main().catch((err) => console.error("Error occured in main script:", err));
