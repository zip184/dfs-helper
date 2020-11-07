const { findAllArrayPermutations } = require("../index");

describe("utils", () => {
  describe("findAllArrayPermutations function", () => {
    it("empty cases", () => {
      expect(findAllArrayPermutations([], 0)).toEqual([]);
      expect(findAllArrayPermutations([], 1)).toEqual([]);
      expect(findAllArrayPermutations([], 2)).toEqual([]);

      expect(findAllArrayPermutations([1, 2, 3], 0)).toEqual([]);
      expect(findAllArrayPermutations(["a", "b"], 0)).toEqual([]);
    });

    it("single cases", () => {
      expect(findAllArrayPermutations([1], 1)).toEqual([[1]]);
      expect(findAllArrayPermutations(["x"], 1)).toEqual([["x"]]);
      expect(findAllArrayPermutations(["x"], 1)).toEqual([["x"]]);
    });

    it("2 items 1 length", () => {
      const items = ["a", "b"];
      const allPerms = findAllArrayPermutations(items, 1);

      expect(allPerms).toContainEqual(["a"]);
      expect(allPerms).toContainEqual(["b"]);
      expect(allPerms).not.toContainEqual(["x"]);
    });

    it("2 items 2 length", () => {
      const items = [2, 3];
      const allPerms = findAllArrayPermutations(items, 2);

      expect(allPerms).toContainEqual([2, 3]);
      expect(allPerms).toContainEqual([3, 2]);
      expect(allPerms).not.toContainEqual([3, 3]);
      expect(allPerms).not.toContainEqual([2, 2]);
    });

    it("3 items 2 length", () => {
      const items = ["x", "y", "z"];
      const allPerms = findAllArrayPermutations(items, 2);

      expect(allPerms).toContainEqual(["x", "y"]);
      expect(allPerms).toContainEqual(["x", "z"]);
      expect(allPerms).toContainEqual(["y", "z"]);
    });

    it("3 items 3 length", () => {
      const items = [7, 8, 9];
      const allPerms = findAllArrayPermutations(items, 3);

      expect(allPerms).toContainEqual([7, 8, 9]);
      expect(allPerms).toContainEqual([7, 8, 9]);
    });
  });
});
