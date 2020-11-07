const { getContestPlayerCount } = require("../index");

describe("lineup-generator", () => {
  describe("getContestPlayerCount function", () => {
    it("empty", () => {
      expect(getContestPlayerCount({ roster: {} })).toBe(0);
      expect(getContestPlayerCount({ roster: { pos1: 0 } })).toBe(0);
      expect(getContestPlayerCount({ roster: { TE: 0, WR: 0 } })).toBe(0);
    });

    it("single", () => {
      expect(getContestPlayerCount({ roster: { FLEX: 0 } })).toBe(0);
      expect(getContestPlayerCount({ roster: { pos1: 1 } })).toBe(1);
      expect(getContestPlayerCount({ roster: { TE: 2 } })).toBe(2);
    });

    it("multiple", () => {
      expect(getContestPlayerCount({ roster: { pos1: 1, pos2: 1 } })).toBe(2);
      expect(getContestPlayerCount({ roster: { QB: 2, WR: 3, TE: 4 } })).toBe(
        9
      );
    });
  });
});
