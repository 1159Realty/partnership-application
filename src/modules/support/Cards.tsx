"use client";
import React, { useState } from "react";
import { SupportCardContentText, SupportCardContentWrapper, SupportCardWrapper } from "./support.styles";
import { MobileB1MGray800, MobileB1SMGray900, MobileCap1MGray400 } from "@/utils/typography";
import { Box, Stack } from "@mui/material";
import { truncateString } from "@/services/string";
import { COLORS } from "@/utils/colors";
import { timeAgo } from "@/services/dateTime";
import { Check, HourglassMedium } from "@phosphor-icons/react/dist/ssr";
import { ISupport } from "@/lib/api/support/types";

interface SupportCardProps {
  support: ISupport;
}
function SupportCard({ support }: SupportCardProps) {
  const maxLength = 100;

  const [showAll, setShowAll] = useState(false);
  return (
    <SupportCardWrapper>
      <Stack direction={"row"} alignItems={"center"} spacing={"5px"} px="10px" py="5px">
        {support?.status === "RESOLVED" ? <Check weight="bold" /> : <HourglassMedium weight="bold" />}
        <MobileB1SMGray900 style={{ textTransform: "capitalize" }}>Ticket #{support?.ticketNum}</MobileB1SMGray900>
      </Stack>
      <SupportCardContentWrapper>
        <SupportCardContentText>
          <MobileB1MGray800>
            {truncateString(support?.message, maxLength, showAll ? "show-all" : undefined)}
            {showAll ? (
              <Box sx={{ cursor: "pointer" }} onClick={() => setShowAll(false)} display={"inline"} color={COLORS.gray500}>
                {" "}
                less
              </Box>
            ) : (
              !showAll &&
              support?.message?.length > maxLength && (
                <Box sx={{ cursor: "pointer" }} onClick={() => setShowAll(true)} display={"inline"} color={COLORS.gray500}>
                  {" "}
                  more
                </Box>
              )
            )}
          </MobileB1MGray800>
        </SupportCardContentText>

        <MobileCap1MGray400>{timeAgo(support?.createdAt)}</MobileCap1MGray400>
      </SupportCardContentWrapper>
    </SupportCardWrapper>
  );
}

export { SupportCard };
