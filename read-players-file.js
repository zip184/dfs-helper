const fs = require("fs");
// const csv = require("csv-parser");

const playerRowKeyNames = [
  "position",
  "name",
  "salary",
  "game",
  "team",
  "avgPoints",
];

const getPlayerFromRow = (rowData) =>
  playerRowKeyNames.reduce(
    (player, key, idx) => ({
      ...player,
      [key]: rowData[idx].trim(),
    }),
    {}
  );

const parseCsvFile = (file) =>
  new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data.split("\n").map((row) => row.split(",")));
    });
  });

const parsePlayerData = (data) => {
  // Check for header row
  if (data[0][0] === "Position") {
    data.shift();
  }

  return data.map(getPlayerFromRow);
};

module.exports = (file) => parseCsvFile(file).then(parsePlayerData);
