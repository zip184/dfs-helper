const readPlayersFile = require("./load-players");
const { generateAllValidLineups } = require("./lineup-generator");

const contest = require("./test-contest.json");

const printIds = (label, players) =>
  console.log(
    label,
    players.map((p) => `${p.playerId} ${p.name} ${p.salary}`)
  );

readPlayersFile("test-players.csv")
  .then((players) => {
    printIds("players", players);
    return generateAllValidLineups(contest, players);
  })
  .then((allPerms) => {
    allPerms.forEach((perm, i) => printIds(`lineup ${i + 1}`, perm));
  })
  .catch((err) => console.error("Error occured reading players file", err));
