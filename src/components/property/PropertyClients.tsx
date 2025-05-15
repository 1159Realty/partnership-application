import React from "react";
// import { ScrollableTabs } from "../tabs";
import { Box, Stack } from "@mui/material";
import { Search } from "../Inputs";
import { PropertyClientCardFlexItem, PropertyClientCardFlexItemValue, PropertyClientCardWrapper } from "./property.styles";
import { Avatar } from "../avatar";
import { MobileB1LightGray500, MobileB1LightGray900 } from "@/utils/typography";
import { Pagination } from "../pagination";
import { NoPropertyClient } from "../cards/NoItemCard";
import { ListHeart } from "@phosphor-icons/react/dist/ssr";

function PropertyClients() {
  // function handleChange() {}

  const noItems = false;

  return (
    <Box>
      {/* <ScrollableTabs onChange={handleChange} tabs={[{} "Interested", "Contacted", "Ongoing", "Completed", "Rejected"]} /> */}
      <Box mt="16px" mb="32px">
        <Search />
      </Box>
      {noItems ? (
        <NoPropertyClient description="No user has show Interest" Icon={ListHeart} />
      ) : (
        <Box>
          <Stack spacing={"32px"}>
            <PropertyClientCard />
            <PropertyClientCard />
            <PropertyClientCard />
          </Stack>
          <Box mt="32px">
            <Pagination count={10} shape="rounded" />
          </Box>
        </Box>
      )}
    </Box>
  );
}

function PropertyClientCard() {
  return (
    <PropertyClientCardWrapper href={""}>
      <PropertyClientCardFlexItem>
        <MobileB1LightGray500>Name</MobileB1LightGray500>
        <PropertyClientCardFlexItemValue>
          <Avatar /> <MobileB1LightGray900>Iyanu Olayemi</MobileB1LightGray900>
        </PropertyClientCardFlexItemValue>
      </PropertyClientCardFlexItem>

      <PropertyClientCardFlexItem>
        <MobileB1LightGray500>Email</MobileB1LightGray500>
        <PropertyClientCardFlexItemValue>
          <MobileB1LightGray900>olayemi@hotmail.com</MobileB1LightGray900>
        </PropertyClientCardFlexItemValue>
      </PropertyClientCardFlexItem>

      <PropertyClientCardFlexItem>
        <MobileB1LightGray500>Agent Assigned</MobileB1LightGray500>
        <PropertyClientCardFlexItemValue>
          <MobileB1LightGray900>Matthew James</MobileB1LightGray900>
        </PropertyClientCardFlexItemValue>
      </PropertyClientCardFlexItem>
    </PropertyClientCardWrapper>
  );
}

export { PropertyClients, PropertyClientCard };
