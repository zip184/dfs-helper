// const classicContest = require("./contests/classic.json");
const testContest = require("./contests/test.json");

const playerRowKeyNames = [
  "position",
  "nameId",
  "name",
  "playerId",
  "rosterPosition",
  "salary",
  "game",
  "team",
  "avgPoints",
];

module.exports = {
  playerRowKeyNames,
  contest: testContest,
  // contest: classicContest,
};
