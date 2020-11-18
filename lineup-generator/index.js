const {
  findAllCombinations,
  calcCombinationsCount,
  colorOutputText,
  numberWithCommas,
} = require("../utils");
const { getPassingLineups } = require("./lineup-validator");

const updateProgressPeriod = 10000;
const outputStream = process.stdout;

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
  const loadingMsg = "Finding all possible player combinations ";
  const cursorPos = loadingMsg.length;
  outputStream.write(loadingMsg);
  const contestPlayerCount = getContestPlayerCount(contest);

  let progress = 0;
  let updateCount = 0;
  const comboCount = calcCombinationsCount(players, contestPlayerCount);

  const allCombos = findAllCombinations(players, contestPlayerCount, (n) => {
    if (updateCount % updateProgressPeriod === 0) {
      const pctComplete = Math.floor((progress / comboCount) * 100);
      outputStream.cursorTo(cursorPos);
      outputStream.write(colorOutputText(`${pctComplete} %`, "magenta"));
    }
    updateCount++;
    progress += n;
  });

  outputStream.cursorTo(cursorPos);
  outputStream.write(
    colorOutputText(
      `found ${numberWithCommas(allCombos.length)} combinations\n`,
      "green"
    )
  );

  return allCombos;
};

const generateAllValidLineups = (contest, players) => {
  const allLineups = getAllLineups(contest, players);

  const validLineups = getPassingLineups(contest, allLineups);

  return Promise.resolve(validLineups);
};

module.exports = {
  generateAllValidLineups,
  getContestPlayerCount,
};
