// Finds all array permutations, including different orders
// No longer used since removing duplicates later is slow
const findAllArrayPermutations = (items, maxSize) => {
  const permSize = maxSize < items.length ? maxSize : items.length;

  // Base cases
  if (permSize === 1) {
    return items.map((p) => [p]);
  }
  if (permSize === 0) {
    return [];
  }

  const allSubPerms = [];

  items.forEach((item) => {
    const restOfItems = items.filter((p) => p !== item);
    const subPerms = findAllArrayPermutations(restOfItems, permSize - 1);

    subPerms.forEach((subPerm) => allSubPerms.push([item, ...subPerm]));
  });

  return allSubPerms;
};

// Not currently longer used since it's many times slower than findAllCombinations
const findAllCombinationsStringify = (items, permSize) => {
  // Base cases
  if (permSize === 1) {
    return items.map((p) => [p]);
  }
  if (permSize === 0) {
    return [];
  }

  const allSubPerms = new Set();

  items.forEach((item) => {
    const restOfItems = items.filter((p) => p !== item);
    const subPerms = findAllArrayPermutations(restOfItems, permSize - 1);

    subPerms.forEach((subPerm) => {
      const combined = JSON.stringify([item, ...subPerm].sort());
      allSubPerms.add(combined);
    });
  });

  return [...allSubPerms].map((perm) => JSON.parse(perm));
};

// Finds all "set unique" array permutations of the given size
const findAllCombinations = (items, size, progressCounter) => {
  if (size === 0 || items.length < size) {
    return [];
  }
  if (size === 1) {
    if (progressCounter) {
      progressCounter(items.length);
    }
    return items.map((item) => [item]);
  }
  if (size === items.length) {
    if (progressCounter) {
      progressCounter(1);
    }
    return [items];
  }

  const tail = items.slice(1);

  // Find all perms that involve the first item
  const headOnlyPerms = findAllCombinations(
    tail,
    size - 1,
    progressCounter
  ).map((perm) => [items[0], ...perm]);

  // Find all perms that do not include the head
  const tailPerms = findAllCombinations(tail, size, progressCounter);

  return headOnlyPerms.concat(tailPerms);
};

const calcCombinationsCount = (items, size) => {
  const factorial = (n) => {
    if (n === 0) {
      return 1;
    }

    return n * factorial(n - 1);
  };

  const n = items.length;

  return factorial(n) / (factorial(size) * factorial(n - size));
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const colorOutputText = (text, color) => {
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

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

module.exports = {
  findAllArrayPermutations,
  findAllCombinationsStringify,
  findAllCombinations,
  calcCombinationsCount,
  sleep,
  colorOutputText,
  numberWithCommas,
};
