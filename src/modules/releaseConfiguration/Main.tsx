"use client";

import { PaginatedResponse } from "@/lib/api/api.types";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { User } from "@phosphor-icons/react/dist/ssr";
import { PageTitle } from "@/components/typography";
import { IReleaseRecipient } from "@/lib/api/release/types";
import { useRelease } from "@/lib/api/release/useRelease";
import { Button } from "@/components/buttons";
import { ROUTES } from "@/utils/constants";
import { Search } from "@/components/Inputs";
import { ReleaseConfigurationForm } from "@/components/forms/ReleaseConfigurationForm";
import { useDebounce } from "use-debounce";
import { ReleaseRecipientsTable } from "@/components/tables/ReleaseRecipientsTable";
import { ConfirmationDialog } from "@/components/dialog/Confirmation";

interface Props {
  releaseRecipientsData: PaginatedResponse<IReleaseRecipient> | null;
  recipientsData: PaginatedResponse<IReleaseRecipient> | null;
}

function Main({ releaseRecipientsData, recipientsData }: Props) {
  const { fetchReleaseRecipients, removeRecipients, addAllRecipients, removeAllRecipients } = useRelease();

  const [recipient, setRecipient] = useState<IReleaseRecipient | null>(null);
  const [releaseRecipients, setReleaseRecipients] = useState(releaseRecipientsData);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [removeRecipientLoading, setRemoveRecipientLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showAddAll, setShowAddAll] = useState(false);
  const [showClearAll, setShowClearAll] = useState(false);
  const [loadingAddAll, setLoadingAddAll] = useState(false);
  const [loadingClearAll, setLoadingClearAll] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 700);

  const hasItem = Boolean(releaseRecipients?.items?.length);

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  async function handleRemove() {
    if (!recipient) return;
    setRemoveRecipientLoading(true);
    await removeRecipients([recipient?.id]);
    setReload(!reload);
    setRemoveRecipientLoading(false);
    setRecipient(null);
  }

  async function handleAddAll() {
    setLoadingAddAll(true);
    const res = await addAllRecipients();
    if (res) {
      setReload(!reload);
      setShowAddAll(false);
    }
    setLoadingAddAll(false);
  }

  async function handleClearAll() {
    setLoadingClearAll(true);
    const res = await removeAllRecipients();

    if (res) {
      setReload(!reload);
      setShowClearAll(false);
    }
    setLoadingClearAll(false);
  }

  useEffect(() => {
    async function getRecipients() {
      const response = await fetchReleaseRecipients({ keyword: debouncedSearchQuery, page: page + 1, limit });
      if (response) {
        setReleaseRecipients(response);
      }
    }
    getRecipients();
  }, [fetchReleaseRecipients, debouncedSearchQuery, limit, page, reload]);

  return (
    <Box>
      <Stack mb="32px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle backUrl={ROUTES["/release"]} mr={"5px"}>
            <Box textTransform={"capitalize"}>Release Configuration</Box>
          </PageTitle>
        </Stack>
      </Stack>

      <Stack rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Box flexGrow={1} maxWidth={300}>
          <Search
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Recipients name or email..."
          />
        </Box>

        <Button onClick={() => setIsOpen(true)}>Enable auto release</Button>
      </Stack>

      <Stack mt="24px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Button onClick={() => setShowClearAll(true)}>Disable all</Button>
        <Button onClick={() => setShowAddAll(true)} variant="outlined">
          Enable all
        </Button>
      </Stack>

      <Box mt="32px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={User}
              noItemCreatedDescription={`No recipients to show`}
              noItemFoundDescription="No recipients found"
              noItemCreated={Boolean(!releaseRecipients?.items?.length && !releaseRecipientsData?.items?.length)}
            />
          </Stack>
        ) : (
          <ReleaseRecipientsTable
            data={releaseRecipients}
            onLimitChange={onLimitChange}
            onPageChange={onPageChange}
            page={page}
            limit={limit}
            onRowClick={(data) => setRecipient(data)}
          />
        )}
      </Box>
      <ReleaseConfigurationForm
        onSubmit={() => setReload(!reload)}
        onClose={() => setIsOpen(false)}
        recipientsData={recipientsData}
        show={isOpen}
      />

      <ConfirmationDialog
        message="Are you sure you want to enable auto release for this recipient?"
        isOpen={Boolean(recipient)}
        onClose={() => setRecipient(null)}
        onConfirm={handleRemove}
        loading={removeRecipientLoading}
      />

      <ConfirmationDialog
        message="Are you sure you want to disable auto release for all recipients?"
        isOpen={showClearAll}
        onClose={() => setShowClearAll(false)}
        onConfirm={handleClearAll}
        loading={loadingClearAll}
      />
      <ConfirmationDialog
        message="Are you sure you want to enable auto release for all recipients?"
        isOpen={showAddAll}
        onClose={() => setShowAddAll(false)}
        onConfirm={handleAddAll}
        loading={loadingAddAll}
      />
    </Box>
  );
}

export { Main };
