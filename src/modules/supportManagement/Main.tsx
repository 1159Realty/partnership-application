"use client";

import { PaginatedResponse } from "@/lib/api/api.types";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Gear, Headset } from "@phosphor-icons/react/dist/ssr";
import { PageTitle } from "@/components/typography";
import { IconButton } from "@/components/buttons";
import Link from "next/link";
import { ROUTES } from "@/utils/constants";
import { ConfirmationDialog } from "@/components/dialog/Confirmation";
import { ISupport, ISupportCategory } from "@/lib/api/support/types";
import { ISupportManagementFilter, SupportManagementFilters } from "@/components/filters/SupportManagementFilters";
import { useSupport } from "@/lib/api/support/useSupport";
import { SupportManagementTable } from "@/components/tables/SupportManagementTable";

interface Props {
  supportData: PaginatedResponse<ISupport> | null;
  supportCategoriesData: PaginatedResponse<ISupportCategory> | null;
}

function Main({ supportData, supportCategoriesData }: Props) {
  const { fetchSupportTickets, resolveSupport, fetchSupportCategories } = useSupport();

  const [supportCategories, setSupportCategories] = useState(supportCategoriesData);
  const [supportTickets, setSupportTickets] = useState(supportData);
  const [supportTicket, setSupportTicket] = useState<ISupport | null>(null);
  const [resolving, setResolving] = useState(false);
  const [reload, setReload] = useState(false);

  const [filters, setFilters] = useState<ISupportManagementFilter>({});

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const hasItem = Boolean(supportTickets?.items?.length);

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  async function handleResolveSupportTicket() {
    if (!supportTicket) return;
    setResolving(true);
    await resolveSupport(supportTicket?.id);
    setReload(!reload);
    setSupportTicket(null);
    setResolving(false);
  }

  useEffect(() => {
    async function getProperties() {
      const response = await fetchSupportTickets({ ...filters, page: page + 1, limit });
      if (response) {
        setSupportTickets(response);
      }
    }
    getProperties();
  }, [fetchSupportTickets, filters, limit, page, reload]);

  useEffect(() => {
    async function getProperties() {
      const response = await fetchSupportCategories();
      if (response) {
        setSupportCategories(response);
      }
    }
    getProperties();
  }, [fetchSupportCategories]);

  return (
    <Box>
      <Stack mb="20" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle mr={"5px"}>
            <Box textTransform={"capitalize"}>Support</Box>
          </PageTitle>
        </Stack>
        <SupportManagementFilters filters={filters} supportCategories={supportCategories} setFilters={setFilters} />
      </Stack>

      <Stack alignItems={"flex-end"}>
        <Link href={`${ROUTES["/support-management"]}/categories`}>
          <IconButton>
            <Gear />
          </IconButton>
        </Link>
      </Stack>

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={Headset}
              noItemCreatedDescription={`No support to show`}
              noItemFoundDescription="No support found"
              noItemCreated={Boolean(!supportTickets?.items?.length && !supportData?.items?.length)}
            />
          </Stack>
        ) : (
          <SupportManagementTable
            data={supportTickets}
            onLimitChange={onLimitChange}
            onPageChange={onPageChange}
            page={page}
            limit={limit}
            onRowClick={(data) => setSupportTicket(data)}
          />
        )}
      </Box>
      <ConfirmationDialog
        message="Are you sure you want to mark this support as resolved?"
        isOpen={Boolean(supportTicket)}
        onClose={() => setSupportTicket(null)}
        onConfirm={handleResolveSupportTicket}
        loading={resolving}
      />
    </Box>
  );
}

export { Main };
