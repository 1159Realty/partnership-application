"use client";

import { StatCard } from "@/components/cards/StatCard";
import { AnalyticsReport, IAvailableReportYears, IMonthlyReport, IYearlyReport } from "@/lib/api/analytics/types";
import { useAnalytics } from "@/lib/api/analytics/useAnalytics";
import { PaginatedResponse } from "@/lib/api/api.types";
import { getYear } from "@/services/dateTime";
import { addCommas } from "@/services/numbers";
import { normalizeMonth } from "@/services/string";
import { COLORS } from "@/utils/colors";
import { MobileB1M, MobileH2MGray900 } from "@/utils/typography";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid2, Stack } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { Icon } from "@phosphor-icons/react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { darken } from "polished";
import { ReactNode, useEffect, useState } from "react";

type Period = "months" | "years";

interface Props {
  availableYearsData?: IAvailableReportYears | null;
  annualReportData?: PaginatedResponse<IYearlyReport> | null;
  monthlyReportData?: PaginatedResponse<IMonthlyReport> | null;
  stats?: {
    label: string;
    value: string;
  }[];
  report: AnalyticsReport;
  label?: string;
  Icon: Icon;
  title: string;
  children?: ReactNode;
  hideLineChart?: boolean;
}
function Report({
  children,
  hideLineChart,
  availableYearsData,
  annualReportData,
  monthlyReportData,
  stats,
  report,
  label,
  Icon,
  title,
}: Props) {
  const { fetchMonthlyReportsData } = useAnalytics();

  const [monthlyReport, setMonthlyReport] = useState(monthlyReportData);
  const [period, setPeriod] = useState<Period>("months");
  const [reportYear, setReportYear] = useState(getYear());

  const yAxisValueFormatter = (value: number) => addCommas(value, true, true);
  useEffect(() => {
    async function get() {
      if (hideLineChart) return;
      const res = await fetchMonthlyReportsData(report, reportYear);
      setMonthlyReport(res);
    }

    get();
  }, [fetchMonthlyReportsData, hideLineChart, report, reportYear]);

  const xAxisData =
    period === "months"
      ? monthlyReport?.items?.map((x) => normalizeMonth(x?.month)) || []
      : annualReportData?.items?.map((x) => x.year);
  const seriesData =
    period === "months" ? monthlyReport?.items?.map((x) => x?.stat) || [] : annualReportData?.items?.map((x) => x.stat);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<CaretDown size={20} weight="bold" />} aria-controls="panel1-content" id="panel1-header">
        <Stack width={"100%"} direction={"row"} rowGap={"20px"} flexWrap={"wrap"} justifyContent={"space-between"}>
          <Stack mr="10px" px="20px" spacing={"10px"} direction={"row"} alignItems={"center"}>
            <Icon size={18} weight="bold" />
            <MobileH2MGray900>{title}</MobileH2MGray900>
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={"20px"} mt="20px">
          {!hideLineChart && (
            <Stack px="20px" spacing={"20px"} direction={"row"} alignItems={"center"} justifyContent={"flex-end"}>
              <select onChange={(e) => setPeriod(e.target.value as Period)} value={period}>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>

              {period === "months" && (
                <select value={reportYear} onChange={(e) => setReportYear(e.target.value)}>
                  {availableYearsData?.items?.map((x) => (
                    <option value={x} key={x}>
                      {x}
                    </option>
                  ))}
                </select>
              )}
            </Stack>
          )}
          {Boolean(stats?.length) && (
            <Box px="20px">
              <Grid2 container spacing={{ xxs: 2, md: 3 }}>
                {stats?.map((x) => (
                  <Grid2 key={x.label} size={{ xxs: 6, md: 4, lg: 3 }}>
                    <StatCard label={x.label} stat={x.value} />
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          )}
          {!hideLineChart &&
            ((xAxisData?.length || 0) < 3 ? (
              <Box px="20px">
                <Box color={"black"} my="20px" textAlign={"center"}>
                  <MobileB1M>{label}</MobileB1M>
                </Box>
                <Grid2 container spacing={{ xxs: 2, md: 3 }}>
                  {xAxisData?.map((x, index) => (
                    <Grid2 key={x} size={{ xxs: 6, md: 4, lg: 3 }}>
                      <StatCard label={x} stat={seriesData?.[index]} />
                    </Grid2>
                  ))}
                </Grid2>
              </Box>
            ) : (
              <LineChart
                xAxis={[{ scaleType: "point", data: xAxisData }]}
                series={[
                  {
                    data: seriesData,
                    label: label,
                    area: true,
                    color: darken(0.1, COLORS.greenLightActive),
                  },
                ]}
                yAxis={[{ valueFormatter: yAxisValueFormatter }]}
                height={300}
              />
            ))}

          {children}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export { Report };
