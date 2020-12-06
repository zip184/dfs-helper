import {
  findAllArrayPermutations,
  findAllCombinationsStringify,
  findAllCombinations,
  ProgressCounter,
  factorial,
} from "../index";

type CommonPermuntationFunction<T> = (
  items: T[],
  maxSize: number,
  progressCounter?: ProgressCounter
) => T[];

const runCommonTests = (testFunction: CommonPermuntationFunction<any>) => {
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

const runUniqueTests = (testFunction: CommonPermuntationFunction<any>) => {
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

  describe("findAllCombinationsStringify function", () => {
    runCommonTests(findAllCombinationsStringify);
    runUniqueTests(findAllCombinationsStringify);
  });

  describe("findAllCombinationsStringify function", () => {
    runCommonTests(findAllCombinations);
    runUniqueTests(findAllCombinations);
  });

  describe("factorial", () => {
    it("1 - 10", () => {
      expect(factorial(1)).toEqual(1);
      expect(factorial(2)).toEqual(2);
      expect(factorial(3)).toEqual(6);
      expect(factorial(4)).toEqual(24);
      expect(factorial(5)).toEqual(120);
      expect(factorial(6)).toEqual(720);
      expect(factorial(7)).toEqual(5040);
      expect(factorial(8)).toEqual(40320);
      expect(factorial(9)).toEqual(362880);
      expect(factorial(10)).toEqual(3628800);
    });
  });
});
