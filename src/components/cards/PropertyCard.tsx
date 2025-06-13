"use client";

import { PropertyCardDetailWrapper, PropertyCardWrapper, PropertyImageDetailWrapper, PropertyImageWrapper } from "./cards.styles";
import { Image } from "../image";
import { Pill } from "../pills";
import { Stack } from "@mui/material";
import { MobileB2MGray900, MobileCap2M, MobileCap2MGray500 } from "@/utils/typography";
import { IProperty } from "@/lib/api/property/property.types";
import { useAlertContext } from "@/contexts/AlertContext";
import { COLORS, SEVERITY_COLORS } from "@/utils/colors";
import { ROUTES } from "@/utils/constants";
import Link from "next/link";
import { addCommas } from "@/services/numbers";
import ReactPlayer from "react-player";

interface Props {
  handleClick?: (id: string) => void;
  property: IProperty | null;
  isManageProperty?: boolean;
  showStatus?: boolean;
  primaryId?: string;
  landSize?: number;
  showLink?: boolean;
  showRemainingLandSize?: boolean;
  showYoutube?: boolean;
}

function PropertyCard({
  handleClick,
  showRemainingLandSize,
  property,
  isManageProperty,
  showStatus,
  primaryId,
  landSize,
  showLink,
  showYoutube,
}: Props) {
  const { setAlert } = useAlertContext();

  const propertyUrl = `${ROUTES["/"]}?propertyId=${property?.id}`;
  const youtubeUrl = property?.youtubeUrl?.trim();
  const renderYoutube = Boolean(youtubeUrl && showYoutube);

  const onClick = () => {
    if (primaryId && handleClick) {
      handleClick?.(primaryId);
      return;
    }

    if (!property || !handleClick) return;
    if (!isManageProperty) {
      if (property.status === "RESERVED") {
        setAlert({ message: "This property has been reserved", severity: "warning", show: true });
        return;
      }
      if (property.status === "SOLD_OUT") {
        setAlert({ message: "This property has sold out", severity: "warning", show: true });
        return;
      }
      if (property.status === "DISABLED") {
        setAlert({ message: "This property is not available", severity: "warning", show: true });
        return;
      }
    }

    handleClick?.(property.id);
  };

  function getAvailability(): { bgColor: string; label: string } | null {
    if (!property) return null;
    if (property.status === "SOLD_OUT") {
      return { bgColor: SEVERITY_COLORS.danger.dark, label: "Sold out" };
    }
    if (property.status === "RESERVED") {
      return { bgColor: SEVERITY_COLORS.warning.dark, label: "Reserved" };
    }
    if (property.status === "DISABLED") {
      return { bgColor: "darkgrey", label: "Archived" };
    }
    return { bgColor: "#28A745", label: "Available" };
  }

  return (
    <PropertyCardWrapper>
      <PropertyImageWrapper onClick={onClick}>
        {renderYoutube ? <ReactPlayer width={"100%"} url={youtubeUrl} /> : <Image src={property?.propertyPic || ""} />}

        {!renderYoutube && (
          <PropertyImageDetailWrapper>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} spacing={"10px"}>
              <Pill>
                {property?.area?.area}, {property?.lga?.lga}, {property?.state?.state}
              </Pill>
              {showStatus && <Pill bgcolor={getAvailability()?.bgColor}>{getAvailability()?.label}</Pill>}
            </Stack>
          </PropertyImageDetailWrapper>
        )}
      </PropertyImageWrapper>
      <PropertyCardDetailWrapper>
        <Stack direction={"row"} justifyContent={"space-between"} spacing={"10px"}>
          {showLink ? (
            <Link style={{ textDecoration: "underline" }} href={propertyUrl}>
              <MobileB2MGray900>{property?.propertyName}</MobileB2MGray900>
            </Link>
          ) : (
            <MobileB2MGray900>{property?.propertyName}</MobileB2MGray900>
          )}

          {showRemainingLandSize && (
            <MobileCap2M style={{ color: COLORS.greenNormalActive }}>
              {addCommas(property?.remainingLandSize, true) || 0} SQM
            </MobileCap2M>
          )}
        </Stack>

        <MobileCap2MGray500>{landSize || property?.availableLandSizes?.map((x) => x.size).join(" SQM, ")} SQM</MobileCap2MGray500>
      </PropertyCardDetailWrapper>
    </PropertyCardWrapper>
  );
}

export { PropertyCard };
