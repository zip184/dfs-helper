import {
  fitsSalaryCap,
  fitsMinSalaryPct,
  underMaxRemainingSalary,
  correctPositionCounts,
  hasTwoDifferentGames,
} from "../index";
import { populateLineup } from "../../index";

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
  opposingTeam: "",
  isHome: false,
  ...fields,
});

const createPlayers = (...positions: string[]): Player[] =>
  positions.map((pos, i) => {
    const player = createPlayer({ playerId: i });
    player.position = pos;
    player.rosterPositions = pos.split("/");
    return player;
  });

const createLineupFromSalaries = (...salaries: number[]) =>
  populateLineup(salaries.map((salary) => createPlayer({ salary })));

const createLineupFromPositions = (...positions: string[]) =>
  populateLineup(createPlayers(...positions));

const createLineupFromPlayers = (...playerFields: object[]) =>
  populateLineup(playerFields.map((field: object) => createPlayer(field)));

describe("validation rules", () => {
  describe("fitsSalaryCap", () => {
    const createContest = (maxSalary: number): Contest => ({
      roster: new Map(),
      playerCount: 0,
      maxSalary,
    });

    it("empty tests", () => {
      expect(
        fitsSalaryCap(createContest(0), createLineupFromSalaries())
      ).toBeTruthy();
      expect(
        fitsSalaryCap(createContest(100), createLineupFromSalaries())
      ).toBeTruthy();
      expect(
        fitsSalaryCap(createContest(-1), createLineupFromSalaries())
      ).not.toBeTruthy();
    });

    it("single player", () => {
      expect(
        fitsSalaryCap(createContest(10), createLineupFromSalaries(5))
      ).toBeTruthy();
      expect(
        fitsSalaryCap(createContest(5), createLineupFromSalaries(5))
      ).toBeTruthy();
      expect(
        fitsSalaryCap(createContest(500), createLineupFromSalaries(501))
      ).not.toBeTruthy();
    });

    it("multiple players", () => {
      expect(
        fitsSalaryCap(createContest(50), createLineupFromSalaries(10, 10, 10))
      ).toBeTruthy();

      expect(
        fitsSalaryCap(createContest(60), createLineupFromSalaries(20, 30, 10))
      ).toBeTruthy();

      expect(
        fitsSalaryCap(
          createContest(800),
          createLineupFromSalaries(100, 500, 200)
        )
      ).toBeTruthy();

      expect(
        fitsSalaryCap(
          createContest(799),
          createLineupFromSalaries(100, 500, 200)
        )
      ).not.toBeTruthy();

      expect(
        fitsSalaryCap(
          createContest(500),
          createLineupFromSalaries(100, 500, 200)
        )
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
        fitsMinSalaryPct(createContest(100), createLineupFromSalaries(60), 0.7)
      ).not.toBeTruthy();

      // Same passes
      expect(
        fitsMinSalaryPct(createContest(100), createLineupFromSalaries(70), 0.7)
      ).toBeTruthy();

      // Over passes
      expect(
        fitsMinSalaryPct(createContest(100), createLineupFromSalaries(80), 0.7)
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
          createLineupFromSalaries(80),
          10
        )
      ).not.toBeTruthy();

      // Same passes
      expect(
        underMaxRemainingSalary(
          createContest(1000),
          createLineupFromSalaries(800),
          200
        )
      ).toBeTruthy();
      expect(
        underMaxRemainingSalary(
          createContest(100),
          createLineupFromSalaries(50, 50),
          0
        )
      ).toBeTruthy();

      // Less passes
      expect(
        underMaxRemainingSalary(
          createContest(100),
          createLineupFromSalaries(90),
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
      expect(
        correctPositionCounts(createContest({}), createLineupFromPositions())
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({ RB: 0, TE: 0 }),
          createLineupFromPositions()
        )
      ).toBeTruthy();

      // One too many of the TE position
      expect(
        correctPositionCounts(
          createContest({}),
          createLineupFromPositions("TE")
        )
      ).not.toBeTruthy();
      expect(
        correctPositionCounts(
          createContest({ TE: 0 }),
          createLineupFromPositions("TE")
        )
      ).not.toBeTruthy();
    });

    it("correct amounts", () => {
      expect(
        correctPositionCounts(
          createContest({
            QB: 1,
          }),
          createLineupFromPositions("QB")
        )
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            RB: 2,
            WR: 3,
          }),
          createLineupFromPositions("WR", "RB", "RB", "WR", "WR")
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
          createLineupFromPositions(
            "DST",
            "WR",
            "RB",
            "TE",
            "RB",
            "WR",
            "WR",
            "QB"
          )
        )
      ).toBeTruthy();
    });

    it("Extra players", () => {
      expect(
        correctPositionCounts(
          createContest({
            DST: 1,
          }),
          createLineupFromPositions("DST", "DST")
        )
      ).not.toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            QB: 1,
          }),
          createLineupFromPositions("QB", "RB")
        )
      ).not.toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            RB: 2,
            WR: 1,
          }),
          createLineupFromPositions("WR", "RB", "RB", "WR", "WR")
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
          createLineupFromPositions("TE", "WR")
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
          createLineupFromPositions("RB", "QB", "RB", "DST")
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
          createLineupFromPositions("TE", "TE") // No QB
        )
      ).not.toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            RB: 1,
            WR: 2,
          }),
          createLineupFromPositions("RB", "WR", "TE") // Missing WR & extra TE
        )
      ).not.toBeTruthy();
    });

    it("Flex single player", () => {
      expect(
        correctPositionCounts(
          createContest({
            RB: 1,
          }),
          createLineupFromPositions("RB/FLEX")
        )
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            FLEX: 1,
          }),
          createLineupFromPositions("RB/FLEX")
        )
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            DST: 1,
          }),
          createLineupFromPositions("RB/FLEX/TE/WR")
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
          createLineupFromPositions("WR/FLEX", "DST")
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
          createLineupFromPositions("WR/FLEX", "RB/FLEX")
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
          createLineupFromPositions("FLEX/RB", "WR/FLEX")
        )
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          createContest({
            RB: 1,
            FLEX: 1,
          }),
          createLineupFromPositions("RB/FLEX", "RB/WR")
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
          createLineupFromPositions(
            "FLEX/WR",
            "FLEX/WR",
            "FLEX/RB",
            "FLEX/RB",
            "QB"
          )
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
          createLineupFromPositions("QB", "FLEX/WR", "RB/FLEX", "FLEX/RB")
        )
      ).toBeTruthy();
      expect(
        correctPositionCounts(
          contest,
          createLineupFromPositions("QB", "FLEX/RB", "WR/FLEX", "WR/FLEX")
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
      expect(
        hasTwoDifferentGames(contest, createLineupFromPositions())
      ).not.toBeTruthy();
    });

    it("Single game fails", () => {
      expect(
        hasTwoDifferentGames(
          contest,
          createLineupFromPlayers({ game: "CHI@TEN 11/08/2020 01:00PM ET" })
        )
      ).not.toBeTruthy();

      expect(
        hasTwoDifferentGames(
          contest,
          createLineupFromPlayers(
            { game: "PIT@DAL 11/08/2020 04:25PM ET" },
            { game: "PIT@DAL 11/08/2020 04:25PM ET" }
          )
        )
      ).not.toBeTruthy();

      expect(
        hasTwoDifferentGames(
          contest,
          createLineupFromPlayers(
            { game: "x" },
            { game: "x" },
            { game: "x" },
            { game: "x" }
          )
        )
      ).not.toBeTruthy();
    });

    it("Two games passes", () => {
      expect(
        hasTwoDifferentGames(
          contest,
          createLineupFromPlayers(
            { game: "CHI@TEN 11/08/2020 01:00PM ET" },
            { game: "PIT@DAL 11/08/2020 04:25PM ET" }
          )
        )
      ).toBeTruthy();

      expect(
        hasTwoDifferentGames(
          contest,
          createLineupFromPlayers(
            { game: "DET@MIN 11/08/2020 01:00PM ET" },
            { game: "PIT@DAL 11/08/2020 04:25PM ET" },
            { game: "DET@MIN 11/08/2020 01:00PM ET" },
            { game: "PIT@DAL 11/08/2020 04:25PM ET" }
          )
        )
      ).toBeTruthy();

      expect(
        hasTwoDifferentGames(
          contest,
          createLineupFromPlayers(
            { game: "x" },
            { game: "y" },
            { game: "y" },
            { game: "x" },
            { game: "x" },
            { game: "x" },
            { game: "y" },
            { game: "y" },
            { game: "y" }
          )
        )
      ).toBeTruthy();
    });

    it("More games passes", () => {
      expect(
        hasTwoDifferentGames(
          contest,
          createLineupFromPlayers(
            { game: "DET@MIN 11/08/2020 01:00PM ET" },
            { game: "PIT@DAL 11/08/2020 04:25PM ET" },
            { game: "DET@MIN 11/08/2020 01:00PM ET" },
            { game: "PIT@DAL 11/08/2020 04:25PM ET" },
            { game: "HOU@JAX 11/08/2020 01:00PM ET" }
          )
        )
      ).toBeTruthy();

      expect(
        hasTwoDifferentGames(
          contest,
          createLineupFromPlayers(
            { game: "DET@MIN 11/08/2020 01:00PM ET" },
            { game: "PIT@DAL 11/08/2020 04:25PM ET" },
            { game: "DEN@ATL 11/08/2020 01:00PM ET" }
          )
        )
      ).toBeTruthy();

      expect(
        hasTwoDifferentGames(
          contest,
          createLineupFromPlayers(
            { game: "x" },
            { game: "y" },
            { game: "x" },
            { game: "x" },
            { game: "z" },
            { game: "x" },
            { game: "y" },
            { game: "a" },
            { game: "b" },
            { game: "x" },
            { game: "x" },
            { game: "z" },
            { game: "x" },
            { game: "y" },
            { game: "x" }
          )
        )
      ).toBeTruthy();
    });
  });
});
