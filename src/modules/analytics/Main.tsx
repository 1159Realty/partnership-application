"use client";

import { PageTitle } from "@/components/typography";
import { IAvailableReportYears, IMonthlyReport, IYearlyReport } from "@/lib/api/analytics/types";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IAgentPerformanceReport } from "@/lib/api/commission/types";
import { EnrollmentsReportTotal } from "@/lib/api/enrollment/types";
import { InvoiceReportTotal } from "@/lib/api/invoice/invoice.types";
import { CountriesReport, IStateReport } from "@/lib/api/location/location.types";
import { ClientReportTotal, GenderReport, TrafficReport } from "@/lib/api/user/user.types";
import { addCommas, formatCurrency } from "@/services/numbers";
import { mapNigerianState } from "@/services/string";
import { COLORS } from "@/utils/colors";
import { BarChart, PieChart } from "@mui/x-charts";
import { Gauge, MapPinLine, Money, UserCirclePlus, UserSwitch } from "@phosphor-icons/react/dist/ssr";
import { darken } from "polished";
import { useEffect, useState } from "react";
import { Report } from "./Report";
import { AgentPerformanceTable } from "@/components/tables/AgentPerformanceTable";
import { useDebounce } from "use-debounce";
import { AgentsPerformanceFilter, IAgentsPerformanceFilter } from "@/components/filters/AgentsPerformanceFilter";
import { Box, Stack } from "@mui/material";
import { useAnalytics } from "@/lib/api/analytics/useAnalytics";

interface Props {
  // sales|invoice
  availableSalesYearsData: IAvailableReportYears | null;
  salesAnnualReportData: PaginatedResponse<IYearlyReport> | null;
  salesMonthlyReportData: PaginatedResponse<IMonthlyReport> | null;
  invoiceReportTotalData: InvoiceReportTotal | null;
  // enrollments
  availableEnrollmentsYearsData: IAvailableReportYears | null;
  enrollmentsAnnualReportData: PaginatedResponse<IYearlyReport> | null;
  enrollmentsMonthlyReportData: PaginatedResponse<IMonthlyReport> | null;
  enrollmentReportTotalData: EnrollmentsReportTotal | null;
  // Clients
  availableClientsYearsData: IAvailableReportYears | null;
  clientsAnnualReportData: PaginatedResponse<IYearlyReport> | null;
  clientsMonthlyReportData: PaginatedResponse<IMonthlyReport> | null;
  clientReportTotalData: ClientReportTotal | null;
  genderReportData: GenderReport | null;
  trafficReportData: PaginatedResponse<TrafficReport> | null;
  // location
  countriesReportData: CountriesReport | null;
  stateReportData: PaginatedResponse<IStateReport> | null;
  // Commission
  agentPerformanceReportData: PaginatedResponse<IAgentPerformanceReport> | null;
}

function Main({
  // sales|invoice
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
  stateReportData,
  // Commission
  agentPerformanceReportData,
}: Props) {
  const { fetchAgentPerformanceReport } = useAnalytics();

  const [agentPerformanceReport, setAgentPerformanceReport] = useState(agentPerformanceReportData);
  const [agentPerformanceReportPage, setAgentPerformanceReportPage] = useState(0);
  const [agentPerformanceReportLimit, setAgentPerformanceReportLimit] = useState(10);
  const [filters, setFilters] = useState<IAgentsPerformanceFilter>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 700);

  const abbrStates = stateReportData?.items?.map((x) => mapNigerianState(x?.state)) || [];

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAgentPerformanceReportLimit(+event.target.value);
    setAgentPerformanceReportPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setAgentPerformanceReportPage(newPage);
  }

  useEffect(() => {
    async function getProperties() {
      const response = await fetchAgentPerformanceReport({
        ...filters,
        page: agentPerformanceReportPage + 1,
        limit: agentPerformanceReportLimit,
        keyword: debouncedSearchQuery,
      });
      if (response) {
        setAgentPerformanceReport(response);
      }
    }
    getProperties();
  }, [agentPerformanceReportLimit, agentPerformanceReportPage, debouncedSearchQuery, fetchAgentPerformanceReport, filters]);

  return (
    <Box>
      <Stack rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <PageTitle mr={"5px"}>
          <Box textTransform={"capitalize"}>Analytics</Box>
        </PageTitle>
      </Stack>

      <Stack spacing={"20px"} mt="20px">
        <Report
          availableYearsData={availableSalesYearsData}
          annualReportData={salesAnnualReportData}
          monthlyReportData={salesMonthlyReportData}
          report="SALE"
          label="Total revenue (₦)"
          title="Sales"
          Icon={Money}
          stats={[
            {
              label: "Expected Total",
              value: formatCurrency(invoiceReportTotalData?.totalInvoiceAmount, true),
            },
            {
              label: "Received Total",
              value: formatCurrency(invoiceReportTotalData?.totalPaidAmount, true),
            },
            {
              label: "Pending Total",
              value: formatCurrency(invoiceReportTotalData?.totalPendingAmount, true),
            },
          ]}
        />

        <Report
          availableYearsData={availableEnrollmentsYearsData}
          annualReportData={enrollmentsAnnualReportData}
          monthlyReportData={enrollmentsMonthlyReportData}
          report="ENROLMENT"
          label="All Enrollments"
          title="Enrollments"
          Icon={UserSwitch}
          stats={[
            {
              label: "Total Active",
              value: addCommas(enrollmentReportTotalData?.totalEnrollments, true),
            },
            {
              label: "Total Completed",
              value: addCommas(enrollmentReportTotalData?.totalCompleted, true),
            },
            {
              label: "Total Cancelled",
              value: addCommas(enrollmentReportTotalData?.totalCancelled, true),
            },
          ]}
        />

        <Report
          availableYearsData={availableClientsYearsData}
          annualReportData={clientsAnnualReportData}
          monthlyReportData={clientsMonthlyReportData}
          report="CLIENT"
          label="Clients onboarded"
          title="Clients"
          Icon={UserCirclePlus}
          stats={[
            {
              label: "Clients onboarded",
              value: addCommas(clientReportTotalData?.allClientsTotal, true),
            },
          ]}
        >
          <>
            <PieChart
              series={[
                {
                  data: [
                    { id: 1, value: genderReportData?.male || 0, label: "Male" },
                    { id: 2, value: genderReportData?.female || 0, label: "Female" },
                    { id: 3, value: genderReportData?.others || 0, label: "Others" },
                  ],
                },
              ]}
              width={200}
              height={200}
            />

            <PieChart
              series={[
                {
                  data:
                    trafficReportData?.items?.map((x, index) => ({
                      id: index + 1,
                      value: x?.total || 0,
                      label: x?.source,
                    })) || [],
                },
              ]}
              width={200}
              height={200}
            />
          </>
        </Report>

        <Report hideLineChart report="LOCATION" title="Locations" Icon={MapPinLine}>
          <>
            <BarChart
              xAxis={[
                {
                  label: "Nigerian states",
                  scaleType: "band",
                  data: stateReportData?.items?.map((x) => mapNigerianState(x?.state)) || [],
                },
              ]}
              series={[
                {
                  data: stateReportData?.items?.map((x) => x?.clientsTotal) || [],
                  color: darken(0.1, COLORS.greenLightActive),
                  valueFormatter: (value, context) => {
                    const abbr = abbrStates[context.dataIndex];
                    return `${mapNigerianState(abbr, "full")}: ${value}`;
                  },
                },
              ]}
              height={300}
            />

            {/* <PieChart
              series={[
                {
                  data: [
                    { id: 1, value: countriesReportData?.nigeria || 0, label: "Nigeria" },
                    { id: 2, value: countriesReportData?.others || 0, label: "Others" },
                  ],
                },
              ]}
              width={200}
              height={200}
            /> */}
          </>
        </Report>

        <Report hideLineChart report="AGENT_PERFORMANCE" title="Agents performance" Icon={Gauge}>
          <>
            <AgentsPerformanceFilter filters={filters} setFilters={setFilters} query={searchQuery} setQuery={setSearchQuery} />
            <AgentPerformanceTable
              data={agentPerformanceReport}
              onLimitChange={onLimitChange}
              onPageChange={onPageChange}
              page={agentPerformanceReportPage}
              limit={agentPerformanceReportLimit}
            />
          </>
        </Report>
      </Stack>
    </Box>
  );
}

export { Main };
