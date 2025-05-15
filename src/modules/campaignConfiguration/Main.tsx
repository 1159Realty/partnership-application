"use client";

import { ScrollableTabs } from "@/components/tabs";
import { PageTitle } from "@/components/typography";
import { PaginatedResponse } from "@/lib/api/api.types";
import { ICampaignRecipientsGroup, ICampaignTemplate, IDesign } from "@/lib/api/campaign/types";
import { Box, Stack, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { CampaignTemplate } from "./CampaignTemplate";
import { RecipientGroup } from "./RecipientGroup";
import { ROUTES } from "@/utils/constants";
import { IState } from "@/lib/api/location/location.types";

interface Props {
  campaignTemplatesData: PaginatedResponse<ICampaignTemplate> | null;
  campaignRecipientsGroupsData: PaginatedResponse<ICampaignRecipientsGroup> | null;
  designsData: PaginatedResponse<IDesign> | null;
  states:IState[]|null
}

function Main({ campaignTemplatesData, campaignRecipientsGroupsData, designsData,states }: Props) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const tabs = ["campaign template", "recipient groups"];
  const maxWidth = useMediaQuery("(max-width: 375px)");

  function handleTabChange(index: number) {
    setCurrentTabIndex(index);
  }

  return (
    <Box>
      <Stack rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <PageTitle backUrl={ROUTES["/campaign"]} mr={"5px"}>
          <Box textTransform={"capitalize"}>Campaign configuration</Box>
        </PageTitle>
      </Stack>

      <Box mt="20px">
        <Box mt="20px">
          <ScrollableTabs showScroll={maxWidth} onChange={handleTabChange} value={currentTabIndex} tabs={tabs} />
        </Box>

        <Box mt="32px">
          {currentTabIndex === 0 ? (
            <CampaignTemplate designsData={designsData} campaignTemplatesData={campaignTemplatesData} />
          ) : (
            <RecipientGroup states={states} campaignRecipientsGroupsData={campaignRecipientsGroupsData} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export { Main };
