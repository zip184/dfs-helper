// const randomRankerScorrer = () => Math.floor(Math.random() * 100);

const salaryRankScorrer = (lineup: Player[]) =>
  lineup.reduce((total, player) => total + +player.salary, 0);

const pointsAvgRankScorrer = (lineup: Player[]) =>
  lineup.reduce((total, player) => {
    const { avgPoints, multiplier } = player;
    let score = +avgPoints;

    if (multiplier) {
      score *= multiplier;
    }

    return total + score;
  }, 0);

const salaryAvgPpgScorrer = (lineup: Player[]) => {
  // const salary = salaryRankScorrer(lineup);
  const ptsAvg = pointsAvgRankScorrer(lineup);

  // Salary is roughly times a players points average, on average
  // return salary / 600 + ptsAvg;
  return ptsAvg;
};

const rankScorrer = salaryAvgPpgScorrer;

export const findTopNLineups = (
  _: Contest,
  allLineups: Player[][],
  n: number,
  scorrer = rankScorrer
) => {
  const scoredLineups = allLineups.map(
    (lineup) =>
      <Lineup>{
        players: lineup,
        score: scorrer(lineup),
        salary: salaryRankScorrer(lineup),
        avgPoints: pointsAvgRankScorrer(lineup),
      }
  );

  scoredLineups.sort((lineA, lineB) => {
    return lineB.score - lineA.score;
  });

  return scoredLineups.splice(0, n);
};
