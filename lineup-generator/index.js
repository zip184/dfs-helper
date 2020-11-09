const { findAllSetPermutations } = require("../utils");
const { getValidLineups } = require("./lineup-validator");

// This has the side effect of saving the count as the 'playerCount' on the contest
const getContestPlayerCount = (contest) => {
  const { roster } = contest;

  const playerCount = Object.values(roster).reduce(
    (total, count) => total + count,
    0
  );

  contest.playerCount = playerCount;

  return playerCount;
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
