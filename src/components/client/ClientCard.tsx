import React from "react";
import { ClientCardWrapper, EmailFont } from "./client.styles";
import { Avatar } from "../avatar";
import { MobileCap2MGray900 } from "@/utils/typography";
import { Stack } from "@mui/material";

function ClientCard() {
  return (
    <ClientCardWrapper href={"#"}>
      <Avatar size="45px" />

      <Stack spacing={"2px"}>
        <MobileCap2MGray900>Micheal Olatunji</MobileCap2MGray900>
        <EmailFont>davidhanah204@gmail.com</EmailFont>
      </Stack>
    </ClientCardWrapper>
  );
}

export { ClientCard };
