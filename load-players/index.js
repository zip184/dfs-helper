const parseCsvFile = require("./read-csv-parser");
// const parseCsvFile = require("./read-fs");

module.exports = async (file) => {
  const data = await parseCsvFile(file);

  // Check for header row
  if (data && data.length > 0 && data[0].position === "Position") {
    data.shift();
  }

  // Add unique 'playerId' column
  let playerId = 1;
  return data.map((player) => ({
    playerId: playerId++,
    ...player,
  }));
};
