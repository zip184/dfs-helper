/* eslint-disable no-console */
import { readPlayersCsv } from "../load-players";
import { generateAllValidLineups } from "../lineup-generator";
import { contest } from "../../dfs-helper.config";
import { findTopNLineups } from "../lineup-ranker";
import { numberWithCommas } from "../utils";

const printLineup = (lineup: Lineup, i: number) => {
  const { score, players, salary, avgPoints } = lineup;

  const lineupPart = `lineup rank #${
    i + 1
  } score: ${score} salary: $${salary} avgPoints: ${avgPoints.toFixed(2)}`;

  const positionRanks = new Map<string, number>();
  [...contest.roster.keys()].forEach((pos, i) => {
    positionRanks.set(pos, i + 1);
  });

  const orderedPlayers = players.sort((pa, pb) => {
    // First by position order
    const fantPosA = lineup.fantasyPositions?.get(pa.playerId);
    const fantPosB = lineup.fantasyPositions?.get(pb.playerId);
    if (!fantPosA || !fantPosB) {
      return 0;
    }

    const aRank = positionRanks.get(fantPosA) || -1;
    const bRank = positionRanks.get(fantPosB) || -1;

    if (aRank < bRank) {
      return -1;
    } else if (aRank > bRank) {
      return 1;
    }

    // Next by salary descending
    return pb.salary - pa.salary;
  });

  console.log(
    lineupPart,
    orderedPlayers.map(
      (p) =>
        `${lineup.fantasyPositions?.get(p.playerId)}: ${p.name} $${p.salary}`
    )
  );
};

const main = async () => {
  const cliArgs = process.argv.slice(2);
  const fileName = cliArgs[0];
  if (!fileName) {
    console.log("Error: Missing file name");
    return;
  }

  const players = await readPlayersCsv(fileName);

  const allLineups = await generateAllValidLineups(contest, players);

  console.log(
    `Total valid lineups found: ${numberWithCommas(allLineups.length)}`
  );

  const topLineups = findTopNLineups(contest, allLineups, 5);

  topLineups.forEach(printLineup);
};

main().catch((err) => console.error("Error occured in main script:", err));
