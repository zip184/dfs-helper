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

module.exports = {
  findAllArrayPermutations,
};
