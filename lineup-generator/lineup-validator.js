const lineupRules = require("./rules");

const getValidLineups = (contest, lineups) => {
  let validLineups = lineups;

  lineupRules.forEach((rule) => {
    validLineups = validLineups.filter((lineup) => rule(contest, lineup));
  });

  return validLineups;
};

module.exports = {
  getValidLineups,
};
