// const randomRankerScorrer = () => Math.floor(Math.random() * 100);

const salaryRankScorrer = (lineup) =>
  lineup.reduce((total, player) => total + +player.salary, 0);

const pointsAvgRankScorrer = (lineup) =>
  lineup.reduce((total, player) => total + +player.avgPoints, 0);

const salaryAvgPpgScorrer = (lineup) =>
  salaryRankScorrer(lineup) + pointsAvgRankScorrer(lineup);

const rankScorrer = salaryAvgPpgScorrer;

const findTopNLineups = (contest, allLineups, n, scorrer = rankScorrer) => {
  const scoredLineups = allLineups.map((lineup) => ({
    lineup,
    score: scorrer(lineup),
  }));

  scoredLineups.sort((lineA, lineB) => {
    return lineB.score - lineA.score;
  });

  return scoredLineups.splice(0, n);
};

module.exports = {
  findTopNLineups,
};
