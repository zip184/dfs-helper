/* eslint-disable no-console */
const { readPlayersCsv } = require("../load-players");
const { generateAllValidLineups } = require("../lineup-generator");
const { contest } = require("../../dfs-helper.config");
const { findTopNLineups } = require("../lineup-ranker");
const { numberWithCommas } = require("../utils");

const printIds = (label, players) =>
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

  topLineups.forEach(({ score, lineup, salary, avgPoints }, i) =>
    printIds(
      `lineup rank #${
        i + 1
      } score: ${score} salary: ${salary} avgPoints: ${avgPoints.toFixed(2)}`,
      lineup.sort((a, b) => b.salary - a.salary)
    )
  );
};

main().catch((err) => console.error("Error occured in main script:", err));
