import { MobileB1SMGray900, MobileCap2MGray600 } from "@/utils/typography";
import { Stack } from "@mui/material";
import React from "react";
import { Avatar } from "../avatar";
import { ClientInfoTextContainer, ClientInfoWrapper } from "./client.styles";
import { Divider } from "../divider";
import { COLORS } from "@/utils/colors";

function ClientInfo() {
  return (
    <ClientInfoWrapper>
      <Avatar size="72px" />
      <ClientInfoTextContainer>
        <Stack spacing={"4px"}>
          <MobileB1SMGray900>Micheal Olatunji</MobileB1SMGray900>
          <MobileCap2MGray600>michealolatunji@gmail.com</MobileCap2MGray600>
        </Stack>

        <Divider border={`0.5px solid ${COLORS.gray200}`} />

        <Stack spacing={"4px"}>
          <MobileCap2MGray600>080675363103</MobileCap2MGray600>
          <MobileCap2MGray600>Plot 205 Arab Road Kubwa Abuja</MobileCap2MGray600>
        </Stack>
      </ClientInfoTextContainer>
    </ClientInfoWrapper>
  );
}

export { ClientInfo };
