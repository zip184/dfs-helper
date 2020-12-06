const fs = require("fs");
const { playerRowKeyNames } = require("../../dfs-helper.config");

const parsePlayerRowRow = (rowData: string[]) =>
  playerRowKeyNames.reduce(
    (player: any, key: string, idx: number) => ({
      ...player,
      [key]: rowData[idx].trim(),
    }),
    {}
  );

const readCsvFile = (file: string): Promise<any> =>
  new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err: Error, data: string) => {
      if (err) {
        return reject(err);
      }

      return resolve(data.split("\n").map((row: string) => row.split(",")));
    });
  });

const parseCsvFile = (file: string) =>
  readCsvFile(file).then((data: string[][]) => data.map(parsePlayerRowRow));

export default parseCsvFile;
