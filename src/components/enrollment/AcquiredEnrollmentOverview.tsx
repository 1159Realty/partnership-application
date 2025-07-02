import { MobileB2MGray900 } from "@/utils/typography";
import React from "react";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { formatCurrency } from "@/services/numbers";
import { PropertyOverviewKey, PropertyOverviewValue } from "./styles";
import { capitalizeAndSpace } from "@/services/string";
import { Stack } from "@mui/material";

interface Props {
  enrollment: IEnrollment | null;
}

function AcquiredEnrollmentOverview({ enrollment }: Props) {
  const marketValue = enrollment?.property?.availableLandSizes?.find((x) => x?.size === enrollment?.landSize)?.marketValue;
  const overview = [
    {
      title: "State",
      value: enrollment?.property?.state?.state || "N/A",
    },
    {
      title: "Area",
      value: enrollment?.property?.area?.area || "N/A",
    },
    {
      title: "Land Mark",
      value: enrollment?.property?.address || "N/A",
    },
    {
      title: "Land Type",
      value: capitalizeAndSpace(enrollment?.property?.landType || "") || "N/A",
    },
    {
      title: "Land Size",
      value: `${enrollment?.landSize || 0} SQM`,
    },
    {
      title: "Plot Id",
      value: enrollment?.plotId || "N/A",
    },
    {
      title: "Market value",
      value: formatCurrency(marketValue) || "N/A",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <MobileB2MGray900>Overview</MobileB2MGray900>
      <div className="flex flex-col gap-3">
        {overview.map(({ title, value }) => (
          <Stack key={title} direction={"column"} spacing={"2px"}>
            <PropertyOverviewKey>{title}</PropertyOverviewKey>
            <PropertyOverviewValue>{value}</PropertyOverviewValue>
          </Stack>
        ))}
      </div>
    </div>
  );
}

export { AcquiredEnrollmentOverview };
