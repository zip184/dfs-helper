const parseCsvFile = require("./read-csv-parser");
// const parseCsvFile = require("./read-fs");

module.exports = async (file) => {
  const data = await parseCsvFile(file);

  // Check for header row
  if (data && data.length > 0 && data[0].position === "Position") {
    data.shift();
  }

  return data;
};
