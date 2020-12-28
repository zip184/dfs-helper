import * as statsService from "../stats-service";
import statsRanker from "./stats-ranker";

// const randomRankerScorrer: LineupScorrer = () => Math.floor(Math.random() * 100);

const salaryRankScorrer: LineupScorrer = (lineup: Lineup) =>
  lineup.players.reduce((total, player) => total + +player.salary, 0);

const pointsAvgRankScorrer: LineupScorrer = (lineup: Lineup) =>
  lineup.players.reduce((total, player) => {
    const { avgPoints, multiplier } = player;
    let score = avgPoints;

    if (multiplier) {
      score *= multiplier;
    }

    return total + score;
  }, 0);

const salaryAvgPpgScorrer: LineupScorrer = (lineup: Lineup) => {
  // const salary = salaryRankScorrer(lineup);
  const ptsAvg = pointsAvgRankScorrer(lineup);

  // Salary is roughly times a players points average, on average
  // return salary / 600 + ptsAvg;
  return ptsAvg;
};

const rankScorrer = statsRanker;
//const rankScorrer = salaryAvgPpgScorrer;

export const findTopNLineups = async (
  _: Contest,
  allLineups: Lineup[],
  n: number,
  scorrer: LineupScorrer = rankScorrer
) => {
  if (rankScorrer === statsRanker) {
    await statsService.fetchStats();
  }

  const scoredLineups = allLineups.map(
    (lineup) =>
      <Lineup>{
        ...lineup,
        players: lineup.players,
        score: scorrer(lineup),
        salary: salaryRankScorrer(lineup),
        avgPoints: pointsAvgRankScorrer(lineup),
      }
  );

  scoredLineups.sort((lineA, lineB) => {
    return (lineB.score || 0) - (lineA.score || 0);
  });

  return scoredLineups.splice(0, n);
};
