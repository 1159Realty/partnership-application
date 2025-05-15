"use client";

import { Button } from "@/components/buttons";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { StatCard } from "@/components/cards/StatCard";
import { CampaignRecipientGroupForm } from "@/components/forms/CampaignRecipientsGroupForm";
import { Search } from "@/components/Inputs";
import { Pagination } from "@/components/pagination";
import { PaginatedResponse } from "@/lib/api/api.types";
import { ICampaignRecipientsGroup } from "@/lib/api/campaign/types";
import { useCampaign } from "@/lib/api/campaign/useCampaign";
import { IState } from "@/lib/api/location/location.types";
import { ROUTES } from "@/utils/constants";
import { Box, Grid2, Stack } from "@mui/material";
import { Megaphone } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface Props {
  campaignRecipientsGroupsData: PaginatedResponse<ICampaignRecipientsGroup> | null;
  states: IState[] | null;
}

function RecipientGroup({ campaignRecipientsGroupsData, states }: Props) {
  const { fetchCampaignRecipientsGroups } = useCampaign();

  const [campaignRecipientGroups, setCampaignRecipientGroups] = useState(campaignRecipientsGroupsData);

  const [searchQuery, setSearchQuery] = useState("");
  const [reload, setReload] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [page, setPage] = useState(1);

  const hasItem = Boolean(campaignRecipientGroups?.items?.length);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 700);

  function handleClose() {
    setIsOpen(false);
  }

  function onCreate() {
    setReload(!reload);
  }

  useEffect(() => {
    async function get() {
      const response = await fetchCampaignRecipientsGroups({ keyword: debouncedSearchQuery, page, limit: 6 });
      if (response) {
        setCampaignRecipientGroups(response);
      }
    }
    get();
  }, [fetchCampaignRecipientsGroups, debouncedSearchQuery, reload, page]);

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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Group name..."
          />
        </Box>

        {hasItem && <Button onClick={() => setIsOpen(true)}>Add Group</Button>}
      </Stack>

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={Megaphone}
              onClick={() => setIsOpen(true)}
              action="Add Campaign Recipients"
              noItemCreatedDescription={`No campaign recipients to show`}
              noItemFoundDescription="No campaign recipients found"
              noItemCreated={Boolean(!campaignRecipientGroups?.items?.length && !campaignRecipientsGroupsData?.items?.length)}
            />
          </Stack>
        ) : (
          <Stack spacing={"30px"}>
            {" "}
            <Grid2 container spacing={{ xxs: 2, md: 3 }}>
              {campaignRecipientGroups?.items?.map((x) => (
                <Grid2 key={x?.id} size={{ xxs: 6, xs: 6, lg: 4 }}>
                  <Link href={`${ROUTES["/campaign"]}/configuration/recipients-group/${x.id}`}>
                    <StatCard sx={{ cursor: "pointer" }} label={x?.name} stat={x?.countRecipients} />
                  </Link>
                </Grid2>
              ))}
            </Grid2>
            <Stack alignItems={"center"}>
              {Boolean(campaignRecipientGroups?.totalPages && campaignRecipientGroups.totalPages > 1) && (
                <Pagination
                  onChange={(_, newPage) => {
                    setPage(newPage);
                  }}
                  count={campaignRecipientGroups?.totalPages || 1}
                  variant="outlined"
                  color="secondary"
                  size="large"
                />
              )}
            </Stack>
          </Stack>
        )}
      </Box>
      <CampaignRecipientGroupForm isOpen={isOpen} onClose={handleClose} onCreate={onCreate} states={states} />
    </Box>
  );
}

export { RecipientGroup };
