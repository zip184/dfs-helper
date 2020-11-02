const readPlayersFile = require("./read-players-file");

readPlayersFile("test-players.csv")
  .then((players) => {
    console.log("success", players);
  })
  .catch((err) => console.error("Error occured reading players file", err));
