interface AppConfig {
  playerRowKeyNames: string[];
  contest: Contest;
  minSalaryThresholdPct: number;
  maxRemainingSalaryThreshold: number;
  requiredPlayers: string[];
}

interface Player {
  playerId: number;
  name: string;
  rosterPositions: string[];
  salary: number;
  position: string;
  game: string;
  team: string;
  avgPoints: number;
  multiplier: number;
}

interface Contest {
  maxSalary: number;
  roster: Map<string, number>;
  playerCount: number;
}

interface Lineup {
  score?: number;
  players: Player[];
  salary: number;
  avgPoints: number;
}

// Returns truthy if rule passes
type RuleFunction = (contest: Contest, lineup: Lineup) => any;

interface LineupRule {
  ruleFunction: RuleFunction;
  title: string;
  isDkValidationRule: boolean;
  usesCacheDb?: boolean;
}
