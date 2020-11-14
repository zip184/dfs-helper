const {
  fitsSalaryCap,
  fitsMinSalaryPct,
  underMaxRemainingSalary,
  correctPositionCounts,
} = require("../index");

const createContest = (roster) => ({
  roster,
  playerCount: Object.values(roster).reduce((total, val) => total + val, 0),
});

const createPlayers = (...positions) =>
  positions.map((pos, i) => ({
    playerId: i + 1,
    rosterPositions: pos,
  }));

describe("validation rules", () => {
  describe("fitsSalaryCap", () => {
    it("empty tests", () => {
      expect(fitsSalaryCap({ maxSalary: 0 }, [], 1)).toBeTruthy();
      expect(fitsSalaryCap({ maxSalary: 100 }, [], 1)).toBeTruthy();
      expect(fitsSalaryCap({ maxSalary: -1 }, [], 1)).not.toBeTruthy();
    });

    it("single player", () => {
      expect(fitsSalaryCap({ maxSalary: 10 }, [{ salary: 5 }], 1)).toBeTruthy();
      expect(fitsSalaryCap({ maxSalary: 5 }, [{ salary: 5 }], 1)).toBeTruthy();
      expect(
        fitsSalaryCap({ maxSalary: 500 }, [{ salary: 501 }], 1)
      ).not.toBeTruthy();
    });

    it("multiple players", () => {
      expect(
        fitsSalaryCap(
          { maxSalary: 50 },
          [{ salary: 10 }, { salary: 10 }, { salary: 10 }],
          1
        )
      ).toBeTruthy();

      expect(
        fitsSalaryCap(
          { maxSalary: 60 },
          [{ salary: 20 }, { salary: 30 }, { salary: 10 }],
          1
        )
      ).toBeTruthy();

      expect(
        fitsSalaryCap(
          { maxSalary: 800 },
          [{ salary: 100 }, { salary: 500 }, { salary: 200 }],
          1
        )
      ).toBeTruthy();

      expect(
        fitsSalaryCap(
          { maxSalary: 799 },
          [{ salary: 100 }, { salary: 500 }, { salary: 200 }],
          1
        )
      ).not.toBeTruthy();

      expect(
        fitsSalaryCap(
          { maxSalary: 500 },
          [{ salary: 100 }, { salary: 500 }, { salary: 200 }],
          1
        )
      ).not.toBeTruthy();
    });
  });

  describe("fitsMinSalaryPct", () => {
    it("test percent threshold", () => {
      // Less fails
      expect(
        fitsMinSalaryPct({ maxSalary: 100 }, [{ salary: 60 }], 0.7)
      ).not.toBeTruthy();

      // Same passes
      expect(
        fitsMinSalaryPct({ maxSalary: 100 }, [{ salary: 70 }], 0.7)
      ).toBeTruthy();

      // Over passes
      expect(
        fitsMinSalaryPct({ maxSalary: 100 }, [{ salary: 80 }], 0.7)
      ).toBeTruthy();
    });
  });

  describe("underMaxRemainingSalary", () => {
    it("test max salary threshold", () => {
      // More fails
      expect(
        underMaxRemainingSalary({ maxSalary: 100 }, [{ salary: 80 }], 10)
      ).not.toBeTruthy();

      // Same passes
      expect(
        underMaxRemainingSalary({ maxSalary: 1000 }, [{ salary: 800 }], 200)
      ).toBeTruthy();
      expect(
        underMaxRemainingSalary(
          { maxSalary: 100 },
          [{ salary: 50 }, { salary: 50 }],
          0
        )
      ).toBeTruthy();

      // Less passes
      expect(
        underMaxRemainingSalary({ maxSalary: 100 }, [{ salary: 90 }], 20)
      ).toBeTruthy();
    });
  });

  describe("correctPositionCounts", () => {
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
});
