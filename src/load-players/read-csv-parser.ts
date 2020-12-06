import { playerRowKeyNames } from "../../dfs-helper.config";

const fs = require("fs");
const csv = require("csv-parser");

const parseCsvFile = (file: string): Promise<any> =>
  new Promise((resolve, reject) => {
    const results: any[] = [];

    return fs
      .createReadStream(file)
      .on("error", reject)
      .pipe(csv(playerRowKeyNames))
      .on("data", (row: any) => results.push(row))
      .on("end", () => resolve(results));
  });

export default parseCsvFile;
