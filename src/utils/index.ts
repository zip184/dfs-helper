// Finds all array permutations, including different orders
// No longer used since removing duplicates later is slow
export const findAllArrayPermutations = <T>(items: T[], maxSize: number) => {
  const permSize = maxSize < items.length ? maxSize : items.length;

  // Base cases
  if (permSize === 1) {
    return items.map((p: T) => [p]);
  }
  if (permSize === 0) {
    return [];
  }

  const allSubPerms: T[][] = [];

  items.forEach((item: T) => {
    const restOfItems = items.filter((p: T) => p !== item);
    const subPerms = findAllArrayPermutations(restOfItems, permSize - 1);

    subPerms.forEach((subPerm: T[]) => allSubPerms.push([item, ...subPerm]));
  });

  return allSubPerms;
};

// Not currently longer used since it's many times slower than findAllCombinations
export const findAllCombinationsStringify = <T>(
  items: T[],
  permSize: number
): T[][] => {
  // Base cases
  if (permSize === 1) {
    return items.map((p: T) => [p]);
  }
  if (permSize === 0) {
    return [];
  }

  const allSubPerms: Set<string> = new Set();

  items.forEach((item: T) => {
    const restOfItems = items.filter((p: T) => p !== item);
    const subPerms = findAllArrayPermutations(restOfItems, permSize - 1);

    subPerms.forEach((subPerm: T[]) => {
      const combined = JSON.stringify([item, ...subPerm].sort());
      allSubPerms.add(combined);
    });
  });

  // TODO TS get spread workin
  return [...allSubPerms].map((perm) => JSON.parse(perm));
};

export type ProgressCounter = (progressInc: number) => void;

// Finds all "set unique" array permutations of the given size
export const findAllCombinations = <T>(
  items: T[],
  size: number,
  progressCounter?: ProgressCounter
) => {
  if (size === 0 || items.length < size) {
    return [];
  }
  if (size === 1) {
    if (progressCounter) {
      progressCounter(items.length);
    }
    return items.map((item: T) => [item]);
  }
  if (size === items.length) {
    if (progressCounter) {
      progressCounter(1);
    }
    return [items];
  }

  const tail = items.slice(1);

  // Find all perms that involve the first item
  const headOnlyPerms: T[][] = findAllCombinations(
    tail,
    size - 1,
    progressCounter
  ).map((perm: T[]) => [items[0], ...perm]);

  // Find all perms that do not include the head
  const tailPerms: T[][] = findAllCombinations(tail, size, progressCounter);

  return headOnlyPerms.concat(tailPerms);
};

export const calcCombinationsCount = <T>(items: T[], size: number) => {
  const n = items.length;
  return factorial(n) / (factorial(size) * factorial(n - size));
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// TODO TS Enum here

export const colorOutputText = (text: string, color: string) => {
  const defaultColorNumber = 37; // white
  let colorNum;

  switch (color) {
    case "black":
      colorNum = 30;
      break;
    case "red":
      colorNum = 31;
      break;
    case "green":
      colorNum = 32;
      break;
    case "yellow":
      colorNum = 33;
      break;
    case "blue":
      colorNum = 34;
      break;
    case "magenta":
      colorNum = 35;
      break;
    case "cyan":
      colorNum = 36;
      break;
    case "white":
      colorNum = 37;
      break;
    default:
      return text;
  }

  return `\x1b[${colorNum}m${text}\x1b[${defaultColorNumber}m`;
};

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const factorial = (n: number): number => {
  let result = 1;
  let curNum = n;

  while (curNum > 1) {
    result *= curNum;
    curNum--;
  }

  return result;
};
