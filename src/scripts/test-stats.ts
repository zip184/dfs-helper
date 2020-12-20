import { getSeasonStats } from "../stats-service";

getSeasonStats(2020).then((res: any) => console.log(res));
