import {
  fitsSalaryCap,
  fitsMinSalaryPct,
  underMaxRemainingSalary,
  correctPositionCounts,
  hasTwoDifferentGames,
} from "../index";

const createPlayer = (fields: object): Player => ({
  playerId: 0,
  rosterPositions: [],
  position: "",
  name: "",
  salary: 0,
  game: "",
  team: "",
  avgPoints: 0,
  multiplier: 0,
  ...fields,
});

const createPlayers = (...positions: string[]): Player[] =>
  positions.map((pos, i) => {
    const player = createPlayer({ playerId: i });
    player.position = pos;
    player.rosterPositions = pos.split("/");
    return player;
  });

describe("validation rules", () => {
  describe("fitsSalaryCap", () => {
    const createContest = (maxSalary: number): Contest => ({
      roster: new Map(),
      playerCount: 0,
      maxSalary,
    });

    it("empty tests", () => {
      expect(fitsSalaryCap(createContest(0), [])).toBeTruthy();
      expect(fitsSalaryCap(createContest(100), [])).toBeTruthy();
      expect(fitsSalaryCap(createContest(-1), [])).not.toBeTruthy();
    });

    it("single player", () => {
      expect(
        fitsSalaryCap(createContest(10), [createPlayer({ salary: 5 })])
      ).toBeTruthy();
      expect(
        fitsSalaryCap(createContest(5), [createPlayer({ salary: 5 })])
      ).toBeTruthy();
      expect(
        fitsSalaryCap(createContest(500), [createPlayer({ salary: 501 })])
      ).not.toBeTruthy();
    });

    it("multiple players", () => {
      expect(
        fitsSalaryCap(createContest(50), [
          createPlayer({ salary: 10 }),
          createPlayer({ salary: 10 }),
          createPlayer({ salary: 10 }),
        ])
      ).toBeTruthy();

      expect(
        fitsSalaryCap(createContest(60), [
          createPlayer({ salary: 20 }),
          createPlayer({ salary: 30 }),
          createPlayer({ salary: 10 }),
        ])
      ).toBeTruthy();

      expect(
        fitsSalaryCap(createContest(800), [
          createPlayer({ salary: 100 }),
          createPlayer({ salary: 500 }),
          createPlayer({ salary: 200 }),
        ])
      ).toBeTruthy();

      expect(
        fitsSalaryCap(createContest(799), [
          createPlayer({ salary: 100 }),
          createPlayer({ salary: 500 }),
          createPlayer({ salary: 200 }),
        ])
      ).not.toBeTruthy();

      expect(
        fitsSalaryCap(createContest(500), [
          createPlayer({ salary: 100 }),
          createPlayer({ salary: 500 }),
          createPlayer({ salary: 200 }),
        ])
      ).not.toBeTruthy();
    });
  });

  describe("fitsMinSalaryPct", () => {
    const createContest = (maxSalary: number): Contest => ({
      roster: new Map(),
      playerCount: 0,
      maxSalary,
    });

    it("test percent threshold", () => {
      // Less fails
      expect(
        fitsMinSalaryPct(
          createContest(100),
          [createPlayer({ salary: 60 })],
          0.7
        )
      ).not.toBeTruthy();

      // Same passes
      expect(
        fitsMinSalaryPct(
          createContest(100),
          [createPlayer({ salary: 70 })],
          0.7
        )
      ).toBeTruthy();

      // Over passes
      expect(
        fitsMinSalaryPct(
          createContest(100),
          [createPlayer({ salary: 80 })],
          0.7
        )
      ).toBeTruthy();
    });
  });

  describe("underMaxRemainingSalary", () => {
    const createContest = (maxSalary: number): Contest => ({
      roster: new Map(),
      playerCount: 0,
      maxSalary,
    });

    it("test max salary threshold", () => {
      // More fails
      expect(
        underMaxRemainingSalary(
          createContest(100),
          [createPlayer({ salary: 80 })],
          10
        )
      ).not.toBeTruthy();

      // Same passes
      expect(
        underMaxRemainingSalary(
          createContest(1000),
          [createPlayer({ salary: 800 })],
          200
        )
      ).toBeTruthy();
      expect(
        underMaxRemainingSalary(
          createContest(100),
          [createPlayer({ salary: 50 }), createPlayer({ salary: 50 })],
          0
        )
      ).toBeTruthy();

      // Less passes
      expect(
        underMaxRemainingSalary(
          createContest(100),
          [createPlayer({ salary: 90 })],
          20
        )
      ).toBeTruthy();
    });
  });

  describe("correctPositionCounts", () => {
    const createContest = (positions: object): Contest => {
      const roster = new Map<string, number>(Object.entries(positions));
      return {
        roster,
        playerCount: Object.values(positions).reduce(
          (total, val) => total + val,
          0
        ),
        maxSalary: 0,
      };
    };

    it("empty cases", () => {
      expect(correctPositionCounts(createContest({}), [])).toBeTruthy();

      expect(
        correctPositionCounts(createContest({ RB: 0, TE: 0 }), [])
      ).toBeTruthy();

      const singlePlayer = createPlayers("TE");
      // One too many of the TE position
      expect(
        correctPositionCounts(createContest({}), singlePlayer)
      ).not.toBeTruthy();
      expect(
        correctPositionCounts(createContest({ TE: 0 }), singlePlayer)
      ).not.toBeTruthy();
    });

    it("correct amounts", () => {
      expect(
        correctPositionCounts(
          createContest({
            QB: 1,
          }),
          createPlayers("QB")
        )
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            RB: 2,
            WR: 3,
          }),
          createPlayers("WR", "RB", "RB", "WR", "WR")
        )
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            QB: 1,
            RB: 2,
            WR: 3,
            TE: 1,
            DST: 1,
          }),
          createPlayers("DST", "WR", "RB", "TE", "RB", "WR", "WR", "QB")
        )
      ).toBeTruthy();
    });

    it("Extra players", () => {
      expect(
        correctPositionCounts(
          createContest({
            DST: 1,
          }),
          createPlayers("DST", "DST")
        )
      ).not.toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            QB: 1,
          }),
          createPlayers("QB", "RB")
        )
      ).not.toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            RB: 2,
            WR: 1,
          }),
          createPlayers("WR", "RB", "RB", "WR", "WR")
        )
      ).not.toBeTruthy();
    });

    it("Missing players", () => {
      expect(
        correctPositionCounts(
          createContest({
            TE: 2,
            WR: 1,
          }),
          createPlayers("TE", "WR")
        )
      ).not.toBeTruthy();
    });

    it("Extra position not in roster", () => {
      expect(
        correctPositionCounts(
          createContest({
            RB: 2,
            QB: 1,
          }),
          createPlayers("RB", "QB", "RB", "DST")
        )
      ).not.toBeTruthy();
    });

    it("Missing a position", () => {
      expect(
        correctPositionCounts(
          createContest({
            TE: 2,
            QB: 1,
          }),
          createPlayers("TE", "TE") // No QB
        )
      ).not.toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            RB: 1,
            WR: 2,
          }),
          createPlayers("RB", "WR", "TE") // Missing WR & extra TE
        )
      ).not.toBeTruthy();
    });

    it("Flex single player", () => {
      expect(
        correctPositionCounts(
          createContest({
            RB: 1,
          }),
          createPlayers("RB/FLEX")
        )
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            FLEX: 1,
          }),
          createPlayers("RB/FLEX")
        )
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            DST: 1,
          }),
          createPlayers("RB/FLEX/TE/WR")
        )
      ).not.toBeTruthy();
    });

    it("Flex fails when first player can fill either", () => {
      expect(
        correctPositionCounts(
          createContest({
            RB: 1,
            FLEX: 1,
          }),
          createPlayers("WR/FLEX", "DST")
        )
      ).not.toBeTruthy();
    });

    it("Flex first picks work", () => {
      expect(
        correctPositionCounts(
          createContest({
            RB: 1,
            FLEX: 1,
          }),
          createPlayers("WR/FLEX", "RB/FLEX")
        )
      ).toBeTruthy();
    });

    it("Flex first picks fail", () => {
      expect(
        correctPositionCounts(
          createContest({
            RB: 1,
            FLEX: 1,
          }),
          createPlayers("FLEX/RB", "WR/FLEX")
        )
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            RB: 1,
            FLEX: 1,
          }),
          createPlayers("RB/FLEX", "RB/WR")
        )
      ).toBeTruthy();
    });

    it("Flex a few fail same pos", () => {
      expect(
        correctPositionCounts(
          createContest({
            QB: 1,
            RB: 1,
            WR: 2,
            FLEX: 1,
          }),
          createPlayers("FLEX/WR", "FLEX/WR", "FLEX/RB", "FLEX/RB", "QB")
        )
      ).toBeTruthy();

      // Different positions but both should pass
      const contest = createContest({
        QB: 1,
        RB: 1,
        WR: 1,
        FLEX: 1,
      });
      expect(
        correctPositionCounts(
          contest,
          createPlayers("QB", "FLEX/WR", "RB/FLEX", "FLEX/RB")
        )
      ).toBeTruthy();
      expect(
        correctPositionCounts(
          contest,
          createPlayers("QB", "FLEX/RB", "WR/FLEX", "WR/FLEX")
        )
      ).toBeTruthy();
    });
  });

  describe("hasTwoDifferentGames", () => {
    const contest: Contest = {
      roster: new Map(),
      playerCount: 0,
      maxSalary: 0,
    };

    it("Empty case", () => {
      expect(hasTwoDifferentGames(contest, [])).not.toBeTruthy();
    });

    it("Single game fails", () => {
      expect(
        hasTwoDifferentGames(contest, [
          createPlayer({ game: "CHI@TEN 11/08/2020 01:00PM ET" }),
        ])
      ).not.toBeTruthy();

      expect(
        hasTwoDifferentGames(contest, [
          createPlayer({ game: "PIT@DAL 11/08/2020 04:25PM ET" }),
          createPlayer({ game: "PIT@DAL 11/08/2020 04:25PM ET" }),
        ])
      ).not.toBeTruthy();

      expect(
        hasTwoDifferentGames(contest, [
          createPlayer({ game: "x" }),
          createPlayer({ game: "x" }),
          createPlayer({ game: "x" }),
          createPlayer({ game: "x" }),
        ])
      ).not.toBeTruthy();
    });

    it("Two games passes", () => {
      expect(
        hasTwoDifferentGames(contest, [
          createPlayer({ game: "CHI@TEN 11/08/2020 01:00PM ET" }),
          createPlayer({ game: "PIT@DAL 11/08/2020 04:25PM ET" }),
        ])
      ).toBeTruthy();

      expect(
        hasTwoDifferentGames(contest, [
          createPlayer({ game: "DET@MIN 11/08/2020 01:00PM ET" }),
          createPlayer({ game: "PIT@DAL 11/08/2020 04:25PM ET" }),
          createPlayer({ game: "DET@MIN 11/08/2020 01:00PM ET" }),
          createPlayer({ game: "PIT@DAL 11/08/2020 04:25PM ET" }),
        ])
      ).toBeTruthy();

      expect(
        hasTwoDifferentGames(contest, [
          createPlayer({ game: "x" }),
          createPlayer({ game: "y" }),
          createPlayer({ game: "y" }),
          createPlayer({ game: "x" }),
          createPlayer({ game: "x" }),
          createPlayer({ game: "x" }),
          createPlayer({ game: "y" }),
          createPlayer({ game: "y" }),
          createPlayer({ game: "y" }),
        ])
      ).toBeTruthy();
    });

    it("More games passes", () => {
      expect(
        hasTwoDifferentGames(contest, [
          createPlayer({ game: "DET@MIN 11/08/2020 01:00PM ET" }),
          createPlayer({ game: "PIT@DAL 11/08/2020 04:25PM ET" }),
          createPlayer({ game: "DET@MIN 11/08/2020 01:00PM ET" }),
          createPlayer({ game: "PIT@DAL 11/08/2020 04:25PM ET" }),
          createPlayer({ game: "HOU@JAX 11/08/2020 01:00PM ET" }),
        ])
      ).toBeTruthy();

      expect(
        hasTwoDifferentGames(contest, [
          createPlayer({ game: "DET@MIN 11/08/2020 01:00PM ET" }),
          createPlayer({ game: "PIT@DAL 11/08/2020 04:25PM ET" }),
          createPlayer({ game: "DEN@ATL 11/08/2020 01:00PM ET" }),
        ])
      ).toBeTruthy();

      expect(
        hasTwoDifferentGames(contest, [
          createPlayer({ game: "x" }),
          createPlayer({ game: "y" }),
          createPlayer({ game: "x" }),
          createPlayer({ game: "x" }),
          createPlayer({ game: "z" }),
          createPlayer({ game: "x" }),
          createPlayer({ game: "y" }),
          createPlayer({ game: "a" }),
          createPlayer({ game: "b" }),
          createPlayer({ game: "x" }),
          createPlayer({ game: "x" }),
          createPlayer({ game: "z" }),
          createPlayer({ game: "x" }),
          createPlayer({ game: "y" }),
          createPlayer({ game: "x" }),
        ])
      ).toBeTruthy();
    });
  });
});
