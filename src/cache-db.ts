import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

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

export const getRosterPositionsCache = () => db.getData(rosterPosPath);

export const setRosterPositionsCache = (newPositions: object) => {
  db.push(rosterPosPath, newPositions);
};

export const saveCache = () => db.save();

export const clearCache = () => {
  db.push(rosterPosPath, {});
  db.save();
};
