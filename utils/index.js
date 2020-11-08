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

// Not currently longer used since it's many times slower than findAllSetPermutations
const findAllSetPermutationsStringify = (items, permSize) => {
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
const findAllSetPermutations = (items, size) => {
  if (size === 0 || items.length < size) {
    return [];
  }
  if (size === 1) {
    return items.map((item) => [item]);
  }
  if (size === items.length) {
    return [items];
  }

  const tail = items.slice(1);

  // Find all perms that involve the first item
  const headOnlyPerms = findAllSetPermutations(tail, size - 1).map((perm) => [
    items[0],
    ...perm,
  ]);

  // Find all perms that do not include the head
  const tailPerms = findAllSetPermutations(tail, size);

  return headOnlyPerms.concat(tailPerms);
};

module.exports = {
  findAllArrayPermutations,
  findAllSetPermutationsStringify,
  findAllSetPermutations,
};
