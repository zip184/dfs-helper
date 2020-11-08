/* eslint-disable no-console */

let lastMark = null;

const mark = () => {
  lastMark = new Date();
  return lastMark;
};

const diff = (markedTime = lastMark) => {
  if (!markedTime) {
    console.log("No marked time");
  }

  const nowTime = new Date();
  const diffMs = nowTime.getTime() - markedTime.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const ms = diffMs % 1000;

  console.log(`${seconds}.${`${ms}`.padStart(3, "0")}`);
};

module.exports = { mark, diff };
