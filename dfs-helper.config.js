const classicContest = require("./contests/classic.json");
// const testContest = require("./contests/test.json");

const playerRowKeyNames = [
  "position",
  "nameId",
  "name",
  "playerId",
  "rosterPositions",
  "salary",
  "game",
  "team",
  "avgPoints",
];

const requiredPlayers = ["Aaron Jones", "Mike Davis", "Stefon Diggs"];

module.exports = {
  playerRowKeyNames,
  // contest: testContest,
  contest: classicContest,
  minSalaryThresholdPct: 0,
  maxRemainingSalaryThreshold: 10000,
  requiredPlayers,
};
