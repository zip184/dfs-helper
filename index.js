const { readPlayersCsv } = require("./load-players");
const { generateAllValidLineups } = require("./lineup-generator");

const { contest } = require("./dfs-helper.config");

const printIds = (label, players) =>
  console.log(
    label,
    players.map((p) => `${p.playerId} ${p.name} ${p.salary}`)
  );

const main = async () => {
  const players = await readPlayersCsv("test-players.csv");

  printIds("players", players);

  const allLineups = await generateAllValidLineups(contest, players);
  allLineups.forEach((perm, i) => printIds(`lineup ${i + 1}`, perm));
};

main().catch((err) => console.error("Error occured in main execution:", err));
