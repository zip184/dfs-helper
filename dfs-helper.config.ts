const mapContest = (contestData: any) => {
  const playerCount = Object.values<number>(contestData.roster).reduce(
    (total: number, count: number) => total + count,
    0
  );

  const contest: Contest = {
    maxSalary: contestData.maxSalary,
    roster: new Map<string, number>(Object.entries(contestData.roster)),
    playerCount,
  };

  return contest;
};

const classicContest = require("./contests/classic.json");
// const testContest = require("./contests/test.json");

export const contest = mapContest(classicContest);

export const playerRowKeyNames = [
  "position",
  "nameId",
  "name",
  "playerId",
  "rosterPositions",
  "salary",
  "game",
  "team",
  "avgPoints",
  "multiplier",
];

export const mapPlayer = (playerData: any) =>
  <Player>{
    playerId: +playerData.playerId,
    position: playerData.position,
    name: playerData.name,
    rosterPositions: playerData.rosterPositions.split("/"),
    salary: +playerData.salary,
    game: playerData.game,
    team: playerData.team,
    avgPoints: +playerData.avgPoints,
    multiplier: +playerData.multiplier,
  };

export const requiredPlayers: string[] = [];

export const minSalaryThresholdPct = 0;
export const maxRemainingSalaryThreshold = 10000;
