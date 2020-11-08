const { findAllSetPermutations } = require("../utils");
const { getValidLineups } = require("./lineup-validator");

const getContestPlayerCount = (contest) => {
  const { roster } = contest;

  return Object.values(roster).reduce((total, count) => total + count, 0);
};

const getAllLineups = (contest, players) => {
  const contestPlayerCount = getContestPlayerCount(contest);

  return findAllSetPermutations(players, contestPlayerCount);
};

const generateAllValidLineups = (contest, players) => {
  const allLineups = getAllLineups(contest, players);

  const validLineups = getValidLineups(contest, allLineups);

  return Promise.resolve(validLineups);
};

module.exports = {
  generateAllValidLineups,
  getContestPlayerCount,
};
