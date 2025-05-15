import { useCallback } from "react";
import { getClient } from "../client.api";
import { AnalyticsReport, IAvailableReportYears, IMonthlyReport, IYearlyReport } from "./types";
import { formatError } from "@/services/errors";
import { InvoiceReportTotal } from "../invoice/invoice.types";
import { EnrollmentsReportTotal } from "../enrollment/types";
import { FetchAgentPerformanceReportArgs, IAgentPerformanceReport } from "../commission/types";
import { PaginatedResponse } from "../api.types";

function useAnalytics() {
  const fetchAvailableReportYears = useCallback(async function (report: AnalyticsReport): Promise<IAvailableReportYears | null> {
    try {
      const response = await getClient<IAvailableReportYears>(`analytics/available-report-years/${report}`);
      if (response?.result) {
        return response.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const fetchYearlyReportsData = useCallback(async function (report: AnalyticsReport): Promise<IYearlyReport[] | null> {
    try {
      const response = await getClient<IYearlyReport[]>(`analytics/yearly-reports-data/${report}`);
      if (response?.result) {
        return response.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const fetchMonthlyReportsData = useCallback(async function (
    report: AnalyticsReport,
    year: string
  ): Promise<PaginatedResponse<IMonthlyReport> | null> {
    try {
      const response = await getClient<PaginatedResponse<IMonthlyReport>>(
        `analytics/monthly-reports-data?report=${report}&year=${year}`
      );
      if (response?.result) {
        return response.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  },
  []);

  const fetchInvoiceReportTotal = useCallback(async (): Promise<InvoiceReportTotal | null> => {
    try {
      const response = await getClient<InvoiceReportTotal | null>(`analytics/invoice`);
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const fetchEnrollmentsReportTotal = useCallback(async (): Promise<EnrollmentsReportTotal | null> => {
    try {
      const response = await getClient<EnrollmentsReportTotal | null>(`analytics/enrolments`);
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const fetchAgentPerformanceReport = useCallback(async function (
    args?: FetchAgentPerformanceReportArgs
  ): Promise<PaginatedResponse<IAgentPerformanceReport> | null> {
    try {
      const response = await getClient<PaginatedResponse<IAgentPerformanceReport> | null>(
        `analytics/agent-performance-report?page=${args?.page || 1}&limit=${args?.limit || 10}${
          args?.month ? `&month=${args.month}` : ""
        }${args?.year ? `&year=${args.year}` : ""}${args?.keyword ? `&keyword=${args.keyword}` : ""}${
          args?.sort ? `&sort=${args.sort}` : ""
        }`
      );

      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  },
  []);
  return {
    fetchAvailableReportYears,
    fetchEnrollmentsReportTotal,
    fetchInvoiceReportTotal,
    fetchYearlyReportsData,
    fetchMonthlyReportsData,
    fetchAgentPerformanceReport,
  };
}

export { useAnalytics };
