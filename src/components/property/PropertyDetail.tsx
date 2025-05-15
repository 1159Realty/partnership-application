import { Box, Stack } from "@mui/material";
import React from "react";
import { PropertyImageDetailWrapper, PropertyImageWrapper } from "./property.styles";
import { Image } from "../image";
import { Pill } from "../pills";
import { PropertyCardDetailWrapper } from "../cards/cards.styles";
import { MobileB2MGray900, MobileCap2MGray500 } from "@/utils/typography";

function PropertyDetail() {
  return (
    <Box>
      <PropertyImageWrapper>
        <Image src={"https://c0.wallpaperflare.com/preview/108/456/1011/white-and-brown-concrete-building.jpg"} />
        <PropertyImageDetailWrapper>
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} spacing={"10px"}>
            <Pill>Tanke, Kwara State</Pill>
            <Pill bgcolor={"#28A745"}>Available</Pill>
          </Stack>
        </PropertyImageDetailWrapper>
      </PropertyImageWrapper>
      <PropertyCardDetailWrapper>
        <MobileB2MGray900>VILLA MANOR PHASE 1</MobileB2MGray900>
        <MobileCap2MGray500>300 SQM, 450 SQM, 600 SQM, and Acres</MobileCap2MGray500>
      </PropertyCardDetailWrapper>
    </Box>
  );
}

export { PropertyDetail };
