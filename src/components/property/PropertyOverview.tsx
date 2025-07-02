import { MobileB2MGray900 } from "@/utils/typography";
import React from "react";
import { PropertyOverviewKey, PropertyOverviewValue } from "./property.styles";
import { IProperty } from "@/lib/api/property/property.types";
import { capitalizeAndSpace } from "@/services/string";
import { Stack } from "@mui/material";
import { addCommas } from "@/services/numbers";

interface Props {
  property: IProperty | null;
  landSize?: number;
}

function PropertyOverview({ property, landSize }: Props) {
  const overview = [
    {
      title: "State",
      value: property?.state?.state || "N/A",
    },
    {
      title: "Area",
      value: property?.area?.area || "N/A",
    },
    {
      title: "Land Mark",
      value: property?.address || "N/A",
    },
    {
      title: "Land Type",
      value: capitalizeAndSpace(property?.landType || "") || "N/A",
    },
    {
      title: "Land Sizes",
      value: `${landSize || property?.availableLandSizes?.map((x) => x.size).join(", ")} (SQM)`,
    },
    {
      title: "Remaining Land Size",
      value: property?.status === "AVAILABLE" ? `${addCommas(property?.remainingLandSize)} SQM` : "N/A",
    },

    {
      title: "Payment Method",
      value: `Outright${property?.paymentDurationOptions.length ? ", Installment" : ""}`,
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

export { PropertyOverview };
