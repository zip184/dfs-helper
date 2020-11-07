const readPlayersFile = require("./load-players");

readPlayersFile("test-players.csv")
  .then((players) => {
    console.log(players);
  })
  .catch((err) => console.error("Error occured reading players file", err));
