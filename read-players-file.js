const fs = require("fs");
const csv = require("csv-parser");

const playerRowKeyNames = [
  "position",
  "name",
  "salary",
  "game",
  "team",
  "avgPoints",
];

const parseCsvFile = (file) =>
  new Promise((resolve, reject) => {
    const results = [];

    return fs
      .createReadStream(file)
      .on("error", reject)
      .pipe(csv(playerRowKeyNames))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results));
  });

module.exports = parseCsvFile;
