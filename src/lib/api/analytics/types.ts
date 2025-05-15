const reports = ["SALE", "ENROLMENT", "CLIENT", "LOCATION", "AGENT_PERFORMANCE"] as const;
type AnalyticsReport = (typeof reports)[number];

interface FetchAvailableReportYearsArgs {
  module: AnalyticsReport;
  //return all years that have at least 1 month of report
}

interface IAvailableReportYears {
  items: string[];
}

interface FetchYearlyReportsDataArgs {
  module: AnalyticsReport;
  // return all years with 12 months of report (just all years except current)
}

interface IYearlyReport {
  year: string;
  stat: number;
}

interface FetchMonthlyReportsDataArgs {
  module: AnalyticsReport;
  year: string;
  // return report for all months in a year
}

interface IMonthlyReport {
  month: string;
  stat: number;
}

export type {
  FetchAvailableReportYearsArgs,
  IYearlyReport,
  IMonthlyReport,
  FetchYearlyReportsDataArgs,
  FetchMonthlyReportsDataArgs,
  IAvailableReportYears,
  AnalyticsReport,
};

export { reports };
