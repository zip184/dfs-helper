export const contestYear = new Date().getFullYear();

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

export const statsRankerOppFactorExponent = 2.0;

export const nflTeams = [
  {
    name: "ARI",
    fullName: "Cardinals",
    location: "Arizona",
  },
  {
    name: "ATL",
    fullName: "Falcons",
    location: "Atlanta",
  },
  {
    name: "BAL",
    fullName: "Ravens",
    location: "Baltimore",
  },
  {
    name: "BUF",
    fullName: "Bills",
    location: "Buffalo",
  },
  {
    name: "CAR",
    fullName: "Panthers",
    location: "Carolina",
  },
  {
    name: "CHI",
    fullName: "Bears",
    location: "Chicago",
  },
  {
    name: "CIN",
    fullName: "Bengals",
    location: "Cincinnati",
  },
  {
    name: "CLE",
    fullName: "Browns",
    location: "Cleveland",
  },
  {
    name: "DAL",
    fullName: "Cowboys",
    location: "Dallas",
  },
  {
    name: "DEN",
    fullName: "Broncos",
    location: "Denver",
  },
  {
    name: "DET",
    fullName: "Lions",
    location: "Detroit",
  },
  {
    name: "GB",
    fullName: "Packers",
    location: "Green Bay",
  },
  {
    name: "HOU",
    fullName: "Texans",
    location: "Houston",
  },
  {
    name: "IND",
    fullName: "Colts",
    location: "Indianapolis",
  },
  {
    name: "JAX",
    fullName: "Jaguars",
    location: "Jacksonville",
  },
  {
    name: "KC",
    fullName: "Chiefs",
    location: "Kansas City",
  },
  {
    name: "LAC",
    fullName: "Chargers",
    location: "Los Angeles",
  },
  {
    name: "LAR",
    fullName: "Rams",
    location: "Los Angeles",
  },
  {
    name: "LV",
    fullName: "Raiders",
    location: "Las Vegas",
  },
  {
    name: "MIA",
    fullName: "Dolphins",
    location: "Miami",
  },
  {
    name: "MIN",
    fullName: "Vikings",
    location: "Minnesota",
  },
  {
    name: "NE",
    fullName: "Patriots",
    location: "New England",
  },
  {
    name: "NO",
    fullName: "Saints",
    location: "New Orleans",
  },
  {
    name: "NYG",
    fullName: "Giants",
    location: "New York",
  },
  {
    name: "NYJ",
    fullName: "Jets",
    location: "New York",
  },
  {
    name: "PHI",
    fullName: "Eagles",
    location: "Philadelphia",
  },
  {
    name: "PIT",
    fullName: "Steelers",
    location: "Pittsburgh",
  },
  {
    name: "SEA",
    fullName: "Seahawks",
    location: "Seattle",
  },
  {
    name: "SF",
    fullName: "49ers",
    location: "San Francisco",
  },
  {
    name: "TB",
    fullName: "Buccaneers",
    location: "Tampa Bay",
  },
  {
    name: "TEN",
    fullName: "Titans",
    location: "Tennessee",
  },
  {
    name: "WAS",
    fullName: "FootballTeam",
    location: "Washington",
  },
];
