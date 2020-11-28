const fs = require("fs");
const csv = require("csv-parser");
const { playerRowKeyNames } = require("../../dfs-helper.config");

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
