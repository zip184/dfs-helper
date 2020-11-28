const fs = require("fs");
const { playerRowKeyNames } = require("../../dfs-helper.config");

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

module.exports = (file) =>
  parseCsvFile(file).then((data) => data.map(getPlayerFromRow));
