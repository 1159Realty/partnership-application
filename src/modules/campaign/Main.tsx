"use client";

import { PageTitle } from "@/components/typography";
import { PaginatedResponse } from "@/lib/api/api.types";
import {
  ICampaign,
  ICampaignRecipientsGroup,
  ICampaignTemplate,
  IDesign,
  IFailedCampaignDelivery,
} from "@/lib/api/campaign/types";
import { Box, Stack } from "@mui/material";
import React from "react";
import { History } from "./History";
import { IconButton } from "@/components/buttons";
import Link from "next/link";
import { ROUTES } from "@/utils/constants";
import { Gear } from "@phosphor-icons/react/dist/ssr";
import { User } from "@/lib/api/user/user.types";

interface Props {
  failedCampaignDeliveriesData: PaginatedResponse<IFailedCampaignDelivery> | null;
  campaignsData: PaginatedResponse<ICampaign> | null;
  designsData: PaginatedResponse<IDesign> | null;
  templatesData: PaginatedResponse<ICampaignTemplate> | null;
  recipientsGroupData: PaginatedResponse<ICampaignRecipientsGroup> | null;
  usersData: PaginatedResponse<User> | null;
}

function Main({ campaignsData, designsData, templatesData, recipientsGroupData, usersData }: Props) {
  return (
    <Box>
      <Stack rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <PageTitle mr={"5px"}>
          <Box textTransform={"capitalize"}>Campaign</Box>
        </PageTitle>

        <Link href={`${ROUTES["/campaign"]}/configuration`}>
          <IconButton>
            <Gear />
          </IconButton>
        </Link>
      </Stack>

      <Box mt="20px">
        <History
          campaignsData={campaignsData}
          designsData={designsData}
          templatesData={templatesData}
          recipientsGroupData={recipientsGroupData}
          usersData={usersData}
        />
      </Box>
    </Box>
  );
}

export { Main };
