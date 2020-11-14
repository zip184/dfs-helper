const { allRules } = require("./rules");

const runRules = (rules, contest, lineups) => {
  let remainingLineups = lineups;

  rules.forEach((rule) => {
    const { title, ruleFunction } = rule;
    const startSize = remainingLineups.length;

    process.stdout.write(
      `Checking: '${title}' on ${remainingLineups.length} lineups - `
    );

    remainingLineups = remainingLineups.filter((lineup) =>
      ruleFunction(contest, lineup)
    );

    const removedCount = startSize - remainingLineups.length;
    process.stdout.write(`removed ${removedCount}\n`);
  });

  return remainingLineups;
};

const getPassingLineups = (contest, lineups) => {
  let validLineups = lineups;

  const validationRules = allRules.filter((rule) => rule.isDkValidationRule);
  validLineups = runRules(validationRules, contest, validLineups);

  const configRules = allRules.filter((rule) => !rule.isDkValidationRule);
  validLineups = runRules(configRules, contest, validLineups);

  return validLineups;
};

module.exports = {
  getPassingLineups,
};
