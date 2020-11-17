const { findAllCombinations } = require("../utils");
const { getPassingLineups } = require("./lineup-validator");

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

  return findAllCombinations(players, contestPlayerCount);
};

const generateAllValidLineups = (contest, players) => {
  process.stdout.write("Finding all possible player permutations\n");
  const allLineups = getAllLineups(contest, players);

  const validLineups = getPassingLineups(contest, allLineups);

  return Promise.resolve(validLineups);
};

module.exports = {
  generateAllValidLineups,
  getContestPlayerCount,
};
