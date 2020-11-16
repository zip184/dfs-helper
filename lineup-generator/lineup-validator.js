const { allRules } = require("./rules");
const { colorOutputText } = require("../utils");

const outputStream = process.stdout;
const updateProgressPeriod = 10000;

const runRules = (rules, contest, lineups) => {
  let remainingLineups = lineups;

  rules.forEach((rule) => {
    const { title, ruleFunction } = rule;
    const startSize = remainingLineups.length;

    const outputLine = `Checking: '${title}' on ${remainingLineups.length} lineups - `;
    const cursorPos = outputLine.length;

    outputStream.write(outputLine);

    remainingLineups = remainingLineups.filter((lineup, i) => {
      const passed = ruleFunction(contest, lineup);

      if (i % updateProgressPeriod === 0) {
        const pctComplete = Math.floor((i / startSize) * 100);
        outputStream.cursorTo(cursorPos);
        outputStream.write(colorOutputText(`${pctComplete} %`, "magenta"));
      }

      return passed;
    });

    const removedCount = startSize - remainingLineups.length;
    outputStream.cursorTo(cursorPos);
    outputStream.write(colorOutputText(`removed ${removedCount}\n`, "green"));
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
