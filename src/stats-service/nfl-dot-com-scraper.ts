import got from "got";
import { parse } from "node-html-parser";

enum SubTeam {
  OFFENSE = "offense",
  DEFENSE = "defense",
  SPECIAL_TEAMS = "special-teams",
}

enum StatGroup {
  PASSING = "passing",
  RUSHING = "rushing",
  RECEIVING = "receiving",
}

class NfsDotComScapingError extends Error {
  constructor(m: string) {
    super("nfl.com scraping error: " + m);
  }
}

const TEAM_COL = "Team";

export class NflDotComStatsProvider implements StatsProvider {
  private year: number;
  private nflStats: SeasonLeagueStats | undefined;

  constructor(year: number) {
    this.year = year;
  }

  createUrl = (year: number, subTeam: string, statGroup: StatGroup) => {
    const baseUrl = "https://www.nfl.com/stats/team-stats";
    const routeSuffix = "reg/all";

    return `${baseUrl}/${subTeam}/${statGroup}/${year}/${routeSuffix}`;
  };

  scrubCell = (cellText: string, colName: string) => {
    let scrubbed = cellText || "";

    if (colName === "Team") {
      const noWhitespaceTeam = cellText.replace(/\W/g, "");

      // Team is written twice, cut in half Ex. "BrownsBrowns" -> "Browns"
      return noWhitespaceTeam.substr(0, noWhitespaceTeam.length / 2);
    }

    scrubbed = scrubbed.trim();
    return scrubbed;
  };

  setNflStats = (statsByTeam: Map<string, SeasonStats>) => {
    const [...allStats] = statsByTeam.values();

    this.nflStats = {
      teams: statsByTeam,
      totals: <SeasonStats>{
        team: "TOTALS",
        allowedPassingYards: allStats.reduce(
          (acc, stats) => acc + stats.allowedPassingYards,
          0
        ),
        allowedRushingYards: allStats.reduce(
          (acc, stats) => acc + stats.allowedRushingYards,
          0
        ),
        passingYards: allStats.reduce(
          (acc, stats) => acc + stats.passingYards,
          0
        ),
        rushingYards: allStats.reduce(
          (acc, stats) => acc + stats.rushingYards,
          0
        ),
      },
    };
  };

  scrapeNflDotComPage = async (
    year: number,
    subTeam: SubTeam,
    statGroup: StatGroup
  ) => {
    try {
      const url = this.createUrl(year, subTeam, statGroup);
      const pageResponse = await got(url, { responseType: "text" });

      const root = parse(pageResponse.body);

      const table = root.querySelector(".d3-o-table--detailed");

      const columns = table
        .querySelector("thead")
        .querySelector("tr")
        .querySelectorAll("th")
        .map((col) => col.text);

      const dataRows = table.querySelector("tbody").querySelectorAll("tr");

      const tableData: any[] = [];

      dataRows.forEach((rowElement) => {
        const dataRow: any = {};
        const cellElements = rowElement.querySelectorAll("td");

        cellElements.forEach((cellElement, colIndex) => {
          const colName = columns[colIndex];
          const cellText = cellElement.text;
          dataRow[colName] = this.scrubCell(cellText, colName);
        });

        tableData.push(dataRow);
      });

      return tableData;
    } catch (error) {
      throw new NfsDotComScapingError(error);
    }
  };

  fetchData = async (): Promise<void> => {
    const defensePassingData = await this.scrapeNflDotComPage(
      this.year,
      SubTeam.DEFENSE,
      StatGroup.PASSING
    );

    const statsByTeam = new Map<string, SeasonStats>(
      defensePassingData.map((teamRow: any) => [
        teamRow[TEAM_COL],
        <SeasonStats>{
          team: teamRow[TEAM_COL],
        },
      ])
    );

    // Defense allowed passing yards
    defensePassingData.forEach((teamRow: any) => {
      const stats = statsByTeam.get(teamRow[TEAM_COL]);
      if (stats) {
        // Should always be true
        stats.allowedPassingYards = +teamRow["Yds"];
      }
    });

    // Defense allowed rushing yards
    const defenseRushingData = await this.scrapeNflDotComPage(
      this.year,
      SubTeam.DEFENSE,
      StatGroup.RUSHING
    );
    defenseRushingData.forEach((teamRow: any) => {
      const stats = statsByTeam.get(teamRow[TEAM_COL]);
      if (stats) {
        // Should always be true
        stats.allowedRushingYards = +teamRow["Rush Yds"];
      }
    });

    // Offense passing data
    const offensePassingData = await this.scrapeNflDotComPage(
      this.year,
      SubTeam.OFFENSE,
      StatGroup.PASSING
    );
    offensePassingData.forEach((teamRow: any) => {
      const stats = statsByTeam.get(teamRow[TEAM_COL]);
      if (stats) {
        // Should always be true
        stats.passingYards = +teamRow["Pass Yds"];
      }
    });

    // Offense rushing data
    const offenseRushingData = await this.scrapeNflDotComPage(
      this.year,
      SubTeam.OFFENSE,
      StatGroup.RUSHING
    );
    offenseRushingData.forEach((teamRow: any) => {
      const stats = statsByTeam.get(teamRow[TEAM_COL]);
      if (stats) {
        // Should always be true
        stats.rushingYards = +teamRow["Rush Yds"];
      }
    });

    this.setNflStats(statsByTeam);
  };

  getSeasonStats = () => {
    if (!this.nflStats) {
      throw new NfsDotComScapingError(
        "Data was not initalized, did you call fetchData() ?"
      );
    }

    return this.nflStats;
  };
}
