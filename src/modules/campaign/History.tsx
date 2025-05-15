"use client";

import { Button } from "@/components/buttons";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { CampaignForm } from "@/components/forms/CampaignForm";
import { Search } from "@/components/Inputs";
import { CampaignHistoryTable } from "@/components/tables/CampaignHistoryTable";
import { PaginatedResponse } from "@/lib/api/api.types";
import { ICampaign, ICampaignRecipientsGroup, ICampaignTemplate, IDesign } from "@/lib/api/campaign/types";
import { useCampaign } from "@/lib/api/campaign/useCampaign";
import { User } from "@/lib/api/user/user.types";
import { Box, Stack } from "@mui/material";
import { Megaphone } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

interface Props {
  campaignsData: PaginatedResponse<ICampaign> | null;
  designsData: PaginatedResponse<IDesign> | null;
  templatesData: PaginatedResponse<ICampaignTemplate> | null;
  recipientsGroupData: PaginatedResponse<ICampaignRecipientsGroup> | null;
  usersData: PaginatedResponse<User> | null;
}

function History({ campaignsData, designsData, templatesData, recipientsGroupData, usersData }: Props) {
  const { fetchCampaigns } = useCampaign();

  const [campaigns, setCampaigns] = useState(campaignsData);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const [reload, setReload] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [campaignQuery, setCampaignQuery] = useState("");

  const hasItem = Boolean(campaigns?.items?.length);

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  function handleSubmit() {
    setReload((prev) => !prev);
  }

  useEffect(() => {
    async function get() {
      const response = await fetchCampaigns({ keyword: campaignQuery, limit, page: page + 1 });
      if (response) {
        setCampaigns(response);
      }
    }
    get();
  }, [campaignQuery, fetchCampaigns, limit, page, reload]);

  return (
    <Box>
      <Stack
        rowGap={"10px"}
        columnGap={"10px"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box flexGrow={1} maxWidth={300}>
          <Search
            value={campaignQuery}
            onChange={(e) => {
              setCampaignQuery(e.target.value);
            }}
            placeholder="Campaign history..."
          />
        </Box>

        {hasItem && <Button onClick={() => setIsOpen(true)}>Add Campaign</Button>}
      </Stack>

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={Megaphone}
              onClick={() => setIsOpen(true)}
              action="Add Campaign"
              noItemCreatedDescription={`No campaign history to show`}
              noItemFoundDescription="No campaign history found"
              noItemCreated={Boolean(!campaigns?.items?.length && !campaignsData?.items?.length)}
            />
          </Stack>
        ) : (
          <CampaignHistoryTable
            data={campaigns}
            onLimitChange={onLimitChange}
            onPageChange={onPageChange}
            page={page}
            limit={limit}
          />
        )}
      </Box>
      <CampaignForm
        designsData={designsData}
        templatesData={templatesData}
        recipientsGroupData={recipientsGroupData}
        usersData={usersData}
        onCreate={handleSubmit}
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
      />
    </Box>
  );
}

export { History };
