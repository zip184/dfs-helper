const { findAllArrayPermutations } = require("../utils");
const { getValidLineups } = require("./lineup-validator");

const getContestPlayerCount = (contest) => {
  const { roster } = contest;

  return Object.values(roster).reduce((total, count) => total + count, 0);
};

const removeDuplicateLineups = (lineups) => {
  const sorted = lineups.map((lineup) =>
    lineup.sort((a, b) => a.playerId - b.playerId)
  );

  return Array.from(new Set(sorted.map(JSON.stringify)), JSON.parse);
};

const getAllLineups = (contest, players) => {
  const contestPlayerCount = getContestPlayerCount(contest);
  const allPerms = findAllArrayPermutations(players, contestPlayerCount);
  return removeDuplicateLineups(allPerms);
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
