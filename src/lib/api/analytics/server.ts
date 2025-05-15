import { formatError } from "@/services/errors";
import { getServer } from "../sever.api";
import { AnalyticsReport, IAvailableReportYears, IMonthlyReport, IYearlyReport } from "./types";
import { InvoiceReportTotal } from "../invoice/invoice.types";
import { EnrollmentsReportTotal } from "../enrollment/types";
import { ClientReportTotal, GenderReport, TrafficReport } from "../user/user.types";
import { CountriesReport, IStateReport } from "../location/location.types";
import { FetchAgentPerformanceReportArgs, IAgentPerformanceReport } from "../commission/types";
import { PaginatedResponse } from "../api.types";

async function fetchAvailableReportYears(reportType: AnalyticsReport): Promise<IAvailableReportYears | null> {
  try {
    const response = await getServer<IAvailableReportYears>(`analytics/available-report-years?report=${reportType}`);
    if (response?.result) {
      return response.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchYearlyReportsData(reportType: AnalyticsReport): Promise<PaginatedResponse<IYearlyReport> | null> {
  try {
    const response = await getServer<PaginatedResponse<IYearlyReport>>(`analytics/yearly-reports-data?report=${reportType}`);
    if (response?.result) {
      return response.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchMonthlyReportsData(
  reportType: AnalyticsReport,
  year: string
): Promise<PaginatedResponse<IMonthlyReport> | null> {
  try {
    const response = await getServer<PaginatedResponse<IMonthlyReport>>(
      `analytics/monthly-reports-data?report=${reportType}&year=${year}`
    );
    if (response?.result) {
      return response.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

//invoice
const fetchInvoiceReportTotal = async (): Promise<InvoiceReportTotal | null> => {
  try {
    const response = await getServer<InvoiceReportTotal | null>(`analytics/invoice`);
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

//enrollments
const fetchEnrollmentsReportTotal = async (): Promise<EnrollmentsReportTotal | null> => {
  try {
    const response = await getServer<EnrollmentsReportTotal | null>(`analytics/enrolments`);
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

// clients
const fetchClientReportTotal = async (): Promise<ClientReportTotal | null> => {
  try {
    const response = await getServer<ClientReportTotal | null>(`analytics/users-client`);
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

const fetchGenderReport = async (): Promise<GenderReport | null> => {
  try {
    const response = await getServer<GenderReport | null>(`analytics/users-gender`);
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

const fetchTrafficReport = async (): Promise<PaginatedResponse<TrafficReport> | null> => {
  try {
    const response = await getServer<PaginatedResponse<TrafficReport> | null>(`analytics/users-traffic`);
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

//Location
const fetchStateReport = async (): Promise<PaginatedResponse<IStateReport> | null> => {
  try {
    const response = await getServer<PaginatedResponse<IStateReport> | null>(`analytics/users-state-location`);
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

const fetchCountriesReport = async (): Promise<CountriesReport | null> => {
  try {
    const response = await getServer<CountriesReport | null>(`invoices/totals`);
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

//agnet performance

async function fetchAgentPerformanceReport(
  args?: FetchAgentPerformanceReportArgs
): Promise<PaginatedResponse<IAgentPerformanceReport> | null> {
  try {
    const response = await getServer<PaginatedResponse<IAgentPerformanceReport> | null>(
      `analytics/agent-performance-report?page=${args?.page || 1}&limit=${args?.limit || 10}${
        args?.month ? `&month=${args.month}` : ""
      }${args?.year ? `&year=${args.year}` : ""}`
    );

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export {
  fetchAvailableReportYears,
  fetchEnrollmentsReportTotal,
  fetchYearlyReportsData,
  fetchMonthlyReportsData,
  fetchInvoiceReportTotal,
  fetchClientReportTotal,
  fetchGenderReport,
  fetchTrafficReport,
  fetchStateReport,
  fetchCountriesReport,
  fetchAgentPerformanceReport,
};
