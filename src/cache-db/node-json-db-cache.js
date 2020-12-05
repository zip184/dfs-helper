const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

const dbLocation = "cache-db/json-cache-db";

const db = new JsonDB(
  new Config(
    dbLocation,
    false, // Auto save
    false, // Pretty
    "/" // Separator
  )
);

const rosterPosPath = "/rosterPositionCountsMatch";

const getRosterPositionsCache = () => db.getData(rosterPosPath);

const setRosterPositionsCache = (newPositions) => {
  db.push(rosterPosPath, newPositions);
};

const saveCache = () => db.save();

const clearCache = () => {
  db.push(rosterPosPath, {});
  db.save();
};

module.exports = {
  getRosterPositionsCache,
  setRosterPositionsCache,
  saveCache,
  clearCache,
};
