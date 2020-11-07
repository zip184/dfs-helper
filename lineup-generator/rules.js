const fitsSalaryCap = (contest, lineup) => {
  const { maxSalary } = contest;

  const totalSalary = lineup.reduce((total, { salary }) => total + +salary, 0);

  return totalSalary <= maxSalary;
};

module.exports = [fitsSalaryCap];
