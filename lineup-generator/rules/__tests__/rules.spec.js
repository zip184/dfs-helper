const { fitsSalaryCap, correctPositionCounts } = require("../index");

describe("validation rules", () => {
  describe("fitsSalaryCap", () => {
    it("empty tests", () => {
      expect(fitsSalaryCap({ maxSalary: 0 }, [])).toBeTruthy();
      expect(fitsSalaryCap({ maxSalary: 100 }, [])).toBeTruthy();
      expect(fitsSalaryCap({ maxSalary: -1 }, [])).not.toBeTruthy();
    });

    it("single player", () => {
      expect(fitsSalaryCap({ maxSalary: 10 }, [{ salary: 5 }])).toBeTruthy();
      expect(fitsSalaryCap({ maxSalary: 5 }, [{ salary: 5 }])).toBeTruthy();
      expect(
        fitsSalaryCap({ maxSalary: 500 }, [{ salary: 501 }])
      ).not.toBeTruthy();
    });

    it("multiple players", () => {
      expect(
        fitsSalaryCap({ maxSalary: 50 }, [
          { salary: 10 },
          { salary: 10 },
          { salary: 10 },
        ])
      ).toBeTruthy();

      expect(
        fitsSalaryCap({ maxSalary: 60 }, [
          { salary: 20 },
          { salary: 30 },
          { salary: 10 },
        ])
      ).toBeTruthy();

      expect(
        fitsSalaryCap({ maxSalary: 800 }, [
          { salary: 100 },
          { salary: 500 },
          { salary: 200 },
        ])
      ).toBeTruthy();

      expect(
        fitsSalaryCap({ maxSalary: 799 }, [
          { salary: 100 },
          { salary: 500 },
          { salary: 200 },
        ])
      ).not.toBeTruthy();

      expect(
        fitsSalaryCap({ maxSalary: 500 }, [
          { salary: 100 },
          { salary: 500 },
          { salary: 200 },
        ])
      ).not.toBeTruthy();
    });
  });

  describe("correctPositionCounts", () => {
    it("empty cases", () => {
      expect(correctPositionCounts({ roster: {} }, [])).toBeTruthy();

      expect(
        correctPositionCounts({ roster: { RB: 0, TE: 0 } }, [])
      ).toBeTruthy();

      const singlePlayer = [{ rosterPosition: "TE" }];
      // One too many of the TE position
      expect(
        correctPositionCounts({ roster: {} }, singlePlayer)
      ).not.toBeTruthy();
      expect(
        correctPositionCounts({ roster: { TE: 0 } }, singlePlayer)
      ).not.toBeTruthy();
    });

    it("correct amounts", () => {
      expect(
        correctPositionCounts(
          {
            roster: {
              QB: 1,
            },
          },
          [{ rosterPosition: "QB" }]
        )
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          {
            roster: {
              RB: 2,
              WR: 3,
            },
          },
          [
            { rosterPosition: "WR" },
            { rosterPosition: "RB" },
            { rosterPosition: "RB" },
            { rosterPosition: "WR" },
            { rosterPosition: "WR" },
          ]
        )
      ).toBeTruthy();

      expect(
        correctPositionCounts(
          {
            roster: {
              QB: 1,
              RB: 2,
              WR: 3,
              TE: 1,
              DST: 1,
            },
          },
          [
            { rosterPosition: "DST" },
            { rosterPosition: "WR" },
            { rosterPosition: "RB" },
            { rosterPosition: "TE" },
            { rosterPosition: "RB" },
            { rosterPosition: "WR" },
            { rosterPosition: "WR" },
            { rosterPosition: "QB" },
          ]
        )
      ).toBeTruthy();
    });

    it("Extra players", () => {
      expect(
        correctPositionCounts(
          {
            roster: {
              DST: 1,
            },
          },
          [{ rosterPosition: "DST" }, { rosterPosition: "DST" }]
        )
      ).not.toBeTruthy();

      correctPositionCounts(
        {
          roster: {
            RB: 2,
            WR: 1,
          },
        },
        [
          { rosterPosition: "WR" },
          { rosterPosition: "RB" },
          { rosterPosition: "RB" },
          { rosterPosition: "WR" },
          { rosterPosition: "WR" },
        ]
      ).not.toBeTruthy();
    });

    it("Missing players", () => {
      correctPositionCounts(
        {
          roster: {
            TE: 2,
            WR: 1,
          },
        },
        [{ rosterPosition: "TE" }, { rosterPosition: "WR" }]
      ).not.toBeTruthy();
    });

    it("Extra position not in roster", () => {
      correctPositionCounts(
        {
          roster: {
            RB: 2,
            QB: 1,
          },
        },
        [
          { rosterPosition: "RB" },
          { rosterPosition: "QB" },
          { rosterPosition: "RB" },
          { rosterPosition: "DST" }, // Extra position
        ]
      ).not.toBeTruthy();
    });

    it("Missing a position", () => {
      correctPositionCounts(
        {
          roster: {
            TE: 2,
            QB: 1,
          },
        },
        [{ rosterPosition: "TE" }, { rosterPosition: "TE" }] // No QB
      ).not.toBeTruthy();
    });
  });
});
