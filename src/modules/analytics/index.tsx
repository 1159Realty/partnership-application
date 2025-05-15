import {
  fetchAgentPerformanceReport,
  fetchAvailableReportYears,
  fetchClientReportTotal,
  fetchCountriesReport,
  fetchEnrollmentsReportTotal,
  fetchGenderReport,
  fetchInvoiceReportTotal,
  fetchMonthlyReportsData,
  fetchStateReport,
  fetchTrafficReport,
  fetchYearlyReportsData,
} from "@/lib/api/analytics/server";
import { Main } from "./Main";
import { ModulePageWrapper } from "@/styles/globals.styles";
import { getYear } from "@/services/dateTime";

async function Analytics() {
  // Sales/invoice
  const availableSalesYearsDataResponse = fetchAvailableReportYears("SALE");
  const salesAnnualReportDataResponse = fetchYearlyReportsData("SALE");
  const salesMonthlyReportDataResponse = fetchMonthlyReportsData("SALE", getYear());
  const invoiceReportTotalDataResponse = fetchInvoiceReportTotal();

  // enrollments
  const availableEnrollmentsYearsDataResponse = fetchAvailableReportYears("ENROLMENT");
  const enrollmentsAnnualReportDataResponse = fetchYearlyReportsData("ENROLMENT");
  const enrollmentsMonthlyReportDataResponse = fetchMonthlyReportsData("ENROLMENT", getYear());
  const enrollmentReportTotalDataResponse = fetchEnrollmentsReportTotal();

  // Clients
  const availableClientsYearsDataResponse = fetchAvailableReportYears("CLIENT");
  const clientsAnnualReportDataResponse = fetchYearlyReportsData("CLIENT");
  const clientsMonthlyReportDataResponse = fetchMonthlyReportsData("CLIENT", getYear());
  const clientReportTotalDataResponse = fetchClientReportTotal();
  const genderReportDataResponse = fetchGenderReport();
  const trafficReportDataResponse = fetchTrafficReport();

  // location
  const countriesReportDataResponse = fetchCountriesReport();
  const stateReportDataResponse = fetchStateReport();

  // Commission
  const agentPerformanceReportDataResponse = fetchAgentPerformanceReport();

  const [
    // Sales/invoice
    availableSalesYearsData,
    salesAnnualReportData,
    salesMonthlyReportData,
    invoiceReportTotalData,
    // enrollments
    availableEnrollmentsYearsData,
    enrollmentsAnnualReportData,
    enrollmentsMonthlyReportData,
    enrollmentReportTotalData,
    // Clients
    availableClientsYearsData,
    clientsAnnualReportData,
    clientsMonthlyReportData,
    clientReportTotalData,
    genderReportData,
    trafficReportData,
    // location
    countriesReportData,
    stateReportData,
    // Commission
    agentPerformanceReportData,
  ] = await Promise.all([
    // Sales/invoice
    availableSalesYearsDataResponse,
    salesAnnualReportDataResponse,
    salesMonthlyReportDataResponse,
    invoiceReportTotalDataResponse,
    // enrollments
    availableEnrollmentsYearsDataResponse,
    enrollmentsAnnualReportDataResponse,
    enrollmentsMonthlyReportDataResponse,
    enrollmentReportTotalDataResponse,
    // Clients
    availableClientsYearsDataResponse,
    clientsAnnualReportDataResponse,
    clientsMonthlyReportDataResponse,
    clientReportTotalDataResponse,
    genderReportDataResponse,
    trafficReportDataResponse,
    // location
    countriesReportDataResponse,
    stateReportDataResponse,
    // Commission
    agentPerformanceReportDataResponse,
  ]);

  return (
    <ModulePageWrapper>
      <Main
        availableSalesYearsData={availableSalesYearsData}
        salesAnnualReportData={salesAnnualReportData}
        salesMonthlyReportData={salesMonthlyReportData}
        invoiceReportTotalData={invoiceReportTotalData}
        // enrollments
        availableEnrollmentsYearsData={availableEnrollmentsYearsData}
        enrollmentsAnnualReportData={enrollmentsAnnualReportData}
        enrollmentsMonthlyReportData={enrollmentsMonthlyReportData}
        enrollmentReportTotalData={enrollmentReportTotalData}
        // Clients
        availableClientsYearsData={availableClientsYearsData}
        clientsAnnualReportData={clientsAnnualReportData}
        clientsMonthlyReportData={clientsMonthlyReportData}
        clientReportTotalData={clientReportTotalData}
        genderReportData={genderReportData}
        trafficReportData={trafficReportData}
        // location
        countriesReportData={countriesReportData}
        stateReportData={stateReportData}
        // Commission
        agentPerformanceReportData={agentPerformanceReportData}
      />
    </ModulePageWrapper>
  );
}

export { Analytics };
