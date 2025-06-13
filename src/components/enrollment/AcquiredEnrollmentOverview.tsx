import { MobileB2MGray900 } from "@/utils/typography";
import React from "react";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { formatCurrency } from "@/services/numbers";
import { PropertyOverviewKey, PropertyOverviewValue } from "./styles";
import { capitalizeAndSpace } from "@/services/string";

interface Props {
  enrollment: IEnrollment | null;
}

function AcquiredEnrollmentOverview({ enrollment }: Props) {
  const marketValue = enrollment?.property?.availableLandSizes?.find((x) => x?.size === enrollment?.landSize)?.marketValue;
  return (
    <div className="flex flex-col gap-4">
      <MobileB2MGray900>Overview</MobileB2MGray900>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>State</PropertyOverviewKey>
          <PropertyOverviewValue>{enrollment?.property?.state?.state}</PropertyOverviewValue>
        </div>
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>Area</PropertyOverviewKey>
          <PropertyOverviewValue>{enrollment?.property?.area?.area}</PropertyOverviewValue>
        </div>
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>Land Mark</PropertyOverviewKey>
          <PropertyOverviewValue>{enrollment?.property?.address || "N/A"}</PropertyOverviewValue>
        </div>
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>Land Type</PropertyOverviewKey>
          <PropertyOverviewValue>{capitalizeAndSpace(enrollment?.property?.landType || "") || "N/A"}</PropertyOverviewValue>
        </div>
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>Land Size</PropertyOverviewKey>
          <PropertyOverviewValue>{enrollment?.landSize} SQM</PropertyOverviewValue>
        </div>
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>Plot Id</PropertyOverviewKey>
          <PropertyOverviewValue>{enrollment?.plotId || "N/A"}</PropertyOverviewValue>
        </div>
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>Market value</PropertyOverviewKey>
          <PropertyOverviewValue> {formatCurrency(marketValue) || "N/A"}</PropertyOverviewValue>
        </div>
        {/* TODO: implement interested people */}
      </div>
    </div>
  );
}

export { AcquiredEnrollmentOverview };
