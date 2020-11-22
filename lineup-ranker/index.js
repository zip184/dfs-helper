// const randomRankerScorrer = () => Math.floor(Math.random() * 100);

const salaryRankScorrer = (lineup) =>
  lineup.reduce((total, player) => total + +player.salary, 0);

const pointsAvgRankScorrer = (lineup) =>
  lineup.reduce((total, player) => {
    const { avgPoints, multiplier } = player;
    let score = +avgPoints;

    if (multiplier) {
      score *= multiplier;
    }

    return total + score;
  }, 0);

const salaryAvgPpgScorrer = (lineup) => {
  const salary = salaryRankScorrer(lineup);
  const ptsAvg = pointsAvgRankScorrer(lineup);

  // Salary is roughly times a players points average, on average
  return salary / 600 + ptsAvg;
};

const rankScorrer = salaryAvgPpgScorrer;

const findTopNLineups = (contest, allLineups, n, scorrer = rankScorrer) => {
  const scoredLineups = allLineups.map((lineup) => ({
    lineup,
    score: scorrer(lineup),
    salary: salaryRankScorrer(lineup),
    avgPoints: pointsAvgRankScorrer(lineup),
  }));

  scoredLineups.sort((lineA, lineB) => {
    return lineB.score - lineA.score;
  });

  return scoredLineups.splice(0, n);
};

module.exports = {
  findTopNLineups,
};
