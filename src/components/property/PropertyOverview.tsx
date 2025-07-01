import { MobileB2MGray900 } from "@/utils/typography";
import React from "react";
import { PropertyOverviewKey, PropertyOverviewValue } from "./property.styles";
import { IProperty } from "@/lib/api/property/property.types";
import { capitalizeAndSpace } from "@/services/string";

interface Props {
  property: IProperty | null;
  landSize?: number;
}

function PropertyOverview({ property, landSize }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <MobileB2MGray900>Overview</MobileB2MGray900>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>State</PropertyOverviewKey>
          <PropertyOverviewValue>{property?.state?.state}</PropertyOverviewValue>
        </div>
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>Area</PropertyOverviewKey>
          <PropertyOverviewValue>{property?.area?.area}</PropertyOverviewValue>
        </div>
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>Payment Method</PropertyOverviewKey>
          <PropertyOverviewValue>Outright{property?.paymentDurationOptions.length ? ", Installment" : ""}</PropertyOverviewValue>
        </div>

        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>Land Type</PropertyOverviewKey>
          <PropertyOverviewValue>{capitalizeAndSpace(property?.landType || "") || "N/A"}</PropertyOverviewValue>
        </div>
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>Land Sizes</PropertyOverviewKey>
          <PropertyOverviewValue>
            {landSize || property?.availableLandSizes?.map((x) => x.size).join(", ")} (SQM)
          </PropertyOverviewValue>
        </div>
        <div className="flex flex-row justify-between gap-1">
          <PropertyOverviewKey>Land Mark</PropertyOverviewKey>
          <PropertyOverviewValue>{property?.address || "N/A"}</PropertyOverviewValue>
        </div>
        {/* TODO: implement interested people */}
      </div>
    </div>
  );
}

export { PropertyOverview };
