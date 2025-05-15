import React from "react";
import { MobileCap2MGray500, MobileH2SMGray900 } from "@/utils/typography";
import { StatCardWrapper } from "./cards.styles";
import { BoxProps, Stack } from "@mui/material";
import { Eye } from "@phosphor-icons/react/dist/ssr";

interface StatCardProps extends BoxProps {
  label: string;
  stat?: string | number;
  showEye?: boolean;
}

function StatCard({ label, stat, showEye, ...boxProps }: StatCardProps) {
  return (
    <StatCardWrapper {...boxProps}>
      <Stack direction={"row"} justifyContent={"space-between"} spacing={"10px"}>
        <MobileCap2MGray500>{label}</MobileCap2MGray500>
        {showEye && <Eye />}
      </Stack>

      <MobileH2SMGray900>{stat || "-"}</MobileH2SMGray900>
    </StatCardWrapper>
  );
}

export { StatCard };
