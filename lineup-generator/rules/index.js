const fitsSalaryCap = (contest, lineup) => {
  const { maxSalary } = contest;

  const totalSalary = lineup.reduce((total, { salary }) => total + +salary, 0);

  return totalSalary <= maxSalary;
};

const getPlayerPositions = ({ rosterPositions }) => rosterPositions.split("/");

const correctPositionCounts = (
  contest,
  lineup,
  skippedAssignmentSet = new Set()
) => {
  const { roster, playerCount } = contest;
  const pickedPositions = new Map();

  let pickedCount = 0;
  let posPlayerHash = null;

  for (let lineupIndex = 0; lineupIndex < lineup.length; lineupIndex++) {
    const player = lineup[lineupIndex];
    const positions = getPlayerPositions(player);

    for (let posIndex = 0; posIndex < positions.length; posIndex++) {
      const pos = positions[posIndex];

      const rosterCount = roster[pos] || 0;
      const curPosCount = pickedPositions[pos] || 0;

      if (rosterCount - curPosCount > 0) {
        // This position is open

        // Check if we've tried this yet
        if (posIndex < positions.length - 1) {
          // We've got more positions after this

          posPlayerHash = `${player.playerId}|${pos}`;
          if (skippedAssignmentSet.has(posPlayerHash)) {
            // We've already tried this configuration, so lets look for another position we haven't tried
            continue;
          }
        }

        pickedPositions.set(pos, curPosCount + 1);
        pickedCount++;

        if (pickedCount === playerCount) {
          // We've found a valid lineup configuration!
          return true;
        }
      }
    }
  }

  // We did not find valid configuration
  if (!posPlayerHash) {
    // We know there were no more optional positions to try so we know this lineup failed
    return false;
  }

  // There's more configurations to try
  skippedAssignmentSet.add(posPlayerHash);
  return correctPositionCounts(contest, lineup, skippedAssignmentSet);
};

module.exports = {
  allRules: [fitsSalaryCap, correctPositionCounts],
  fitsSalaryCap,
  correctPositionCounts,
};
