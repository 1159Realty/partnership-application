"use client";

import { PageTitle } from "@/components/typography";
import { PaginatedResponse } from "@/lib/api/api.types";
import { ICampaignRecipient, ICampaignRecipientsGroup } from "@/lib/api/campaign/types";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@/components/buttons";
import { ROUTES } from "@/utils/constants";
import { Gear, Users } from "@phosphor-icons/react/dist/ssr";
import { IState } from "@/lib/api/location/location.types";
import { CampaignRecipientGroupForm } from "@/components/forms/CampaignRecipientsGroupForm";
import { Search } from "@/components/Inputs";
import { useDebounce } from "use-debounce";
import { useCampaign } from "@/lib/api/campaign/useCampaign";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { CampaignRecipientsTable } from "@/components/tables/CampaignRecipientsTable";
import { ConfirmationDialog } from "@/components/dialog/Confirmation";
import { CampaignRecipientForm } from "@/components/forms/CampaignRecipientForm";
import { User } from "@/lib/api/user/user.types";

interface Props {
  recipientsData: PaginatedResponse<ICampaignRecipient> | null;
  recipientGroup: ICampaignRecipientsGroup | null;
  states: IState[] | null;
  groupId: string;
  usersData: PaginatedResponse<User> | null;
}

function Main({ recipientsData, states, recipientGroup, groupId, usersData }: Props) {
  const { fetchCampaignRecipients, removeCampaignRecipients } = useCampaign();

  const [recipient, setRecipient] = useState<ICampaignRecipient | null>(null);
  const [recipients, setRecipients] = useState(recipientsData);

  const [reload, setReload] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRecipient, setIsOpenRecipient] = useState(false);
  const [removeRecipientLoading, setRemoveRecipientLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const hasItem = Boolean(recipients?.items?.length);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 700);

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleUpdate() {
    setIsOpen(false);
    setReload(!reload);
  }

  async function handleRemove() {
    if (!recipient) return;
    setRemoveRecipientLoading(true);
    const res = await removeCampaignRecipients(recipient?.id);
    if (res) {
      setReload(!reload);
      setRecipient(null);
    }
    setRemoveRecipientLoading(false);
  }

  useEffect(() => {
    async function get() {
      const response = await fetchCampaignRecipients(groupId, { page: page + 1, limit, keyword: debouncedSearchQuery });
      if (response) {
        setRecipients(response);
      }
    }
    get();
  }, [fetchCampaignRecipients, limit, page, reload, debouncedSearchQuery, groupId]);

  return (
    <Box>
      <Stack rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <PageTitle backUrl={`${ROUTES["/campaign"]}/configuration`} mr={"5px"}>
          <Box textTransform={"capitalize"}>{recipientGroup?.name}</Box>
        </PageTitle>

        <IconButton onClick={() => setIsOpen(true)}>
          <Gear />
        </IconButton>
      </Stack>

      <Stack
        rowGap={"10px"}
        columnGap={"10px"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        mt="20px"
      >
        <Box flexGrow={1} maxWidth={300}>
          <Search
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Recipient..."
          />
        </Box>
        {hasItem && <Button onClick={() => setIsOpenRecipient(true)}>Add Recipients</Button>}
      </Stack>

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={Users}
              action="Add Recipients"
              onClick={() => setIsOpenRecipient(true)}
              noItemCreatedDescription={`No recipients to show`}
              noItemFoundDescription="No recipients found"
              noItemCreated={Boolean(!recipients?.items?.length && !recipientsData?.items?.length)}
            />
          </Stack>
        ) : (
          <CampaignRecipientsTable
            data={recipients}
            onLimitChange={onLimitChange}
            onPageChange={onPageChange}
            page={page}
            limit={limit}
            onRowClick={(data) => setRecipient(data)}
          />
        )}
      </Box>

      <CampaignRecipientGroupForm
        isOpen={isOpen}
        onClose={handleClose}
        data={recipientGroup}
        onCreate={handleUpdate}
        states={states}
      />

      <CampaignRecipientForm
        recipientGroup={recipientGroup}
        usersData={usersData}
        show={isOpenRecipient}
        onSubmit={() => setReload(!reload)}
        onClose={() => setIsOpenRecipient(false)}
      />

      <ConfirmationDialog
        message="Are you sure you want to remove this recipient?"
        isOpen={Boolean(recipient)}
        onClose={() => setRecipient(null)}
        onConfirm={handleRemove}
        loading={removeRecipientLoading}
      />
    </Box>
  );
}

export { Main };
