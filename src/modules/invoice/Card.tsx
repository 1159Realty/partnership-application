import React from "react";
import { ClientCardWrapper } from "./styles";
import { MobileCap2MGray500, MobileH2SMGray900 } from "@/utils/typography";

interface StatCardProps {
  label: string;
  stat: number;
}

function StatCard({ label, stat }: StatCardProps) {
  return (
    <ClientCardWrapper>
      <MobileCap2MGray500>{label}</MobileCap2MGray500>
      <MobileH2SMGray900>{stat || "-"}</MobileH2SMGray900>
    </ClientCardWrapper>
  );
}

export { StatCard };
