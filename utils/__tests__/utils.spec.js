const {
  findAllArrayPermutations,
  findAllSetPermutationsStringify,
  findAllSetPermutations,
} = require("../index");

const runCommonTests = (testFunction) => {
  it("empty cases", () => {
    expect(testFunction([], 0)).toEqual([]);
    expect(testFunction([], 1)).toEqual([]);
    expect(testFunction([], 2)).toEqual([]);

    expect(testFunction([1, 2, 3], 0)).toEqual([]);
    expect(testFunction(["a", "b"], 0)).toEqual([]);
  });

  it("single cases", () => {
    expect(testFunction([1], 1)).toEqual([[1]]);
    expect(testFunction(["x"], 1)).toEqual([["x"]]);
    expect(testFunction(["x"], 1)).toEqual([["x"]]);
  });

  it("2 items 1 length", () => {
    const items = ["a", "b"];
    const allPerms = testFunction(items, 1);

    expect(allPerms).toContainEqual(["a"]);
    expect(allPerms).toContainEqual(["b"]);
    expect(allPerms).not.toContainEqual(["x"]);
  });

  it("3 items 3 length", () => {
    const items = [7, 8, 9];
    const allPerms = testFunction(items, 3);

    expect(allPerms).toContainEqual([7, 8, 9]);
  });
};

const runUniqueTests = (testFunction) => {
  it("2 items 2 length", () => {
    const items = [2, 3];
    const allPerms = testFunction(items, 2);

    expect(allPerms).toContainEqual([2, 3]);
    expect(allPerms).not.toContainEqual([3, 2]);
    expect(allPerms).not.toContainEqual([3, 3]);
    expect(allPerms).not.toContainEqual([2, 2]);
  });

  it("3 items 2 length", () => {
    const items = ["x", "y", "z"];
    const allPerms = testFunction(items, 2);

    expect(allPerms).toContainEqual(["x", "y"]);
    expect(allPerms).toContainEqual(["x", "z"]);
    expect(allPerms).toContainEqual(["y", "z"]);
    expect(allPerms).not.toContainEqual(["z", "x"]);
    expect(allPerms).not.toContainEqual(["z", "y"]);
    expect(allPerms).not.toContainEqual(["y", "x"]);
    expect(allPerms).not.toContainEqual(["x", "x"]);
    expect(allPerms).not.toContainEqual(["y", "y"]);
    expect(allPerms).not.toContainEqual(["z", "z"]);
  });
};

describe("utils", () => {
  describe("findAllArrayPermutations function", () => {
    runCommonTests(findAllArrayPermutations);

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
  });

  describe("findAllSetPermutationsStringify function", () => {
    runCommonTests(findAllSetPermutationsStringify);
    runUniqueTests(findAllSetPermutationsStringify);
  });

  describe("findAllSetPermutationsStringify function", () => {
    runCommonTests(findAllSetPermutations);
    runUniqueTests(findAllSetPermutations);
  });
});
