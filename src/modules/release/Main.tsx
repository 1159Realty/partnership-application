"use client";

import { PaginatedResponse } from "@/lib/api/api.types";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { CreditCard, Gear } from "@phosphor-icons/react/dist/ssr";
import { PageTitle } from "@/components/typography";
import { IRelease } from "@/lib/api/release/types";
import { useRelease } from "@/lib/api/release/useRelease";
import { IconButton } from "@/components/buttons";
import { ReleaseTable } from "@/components/tables/ReleaseTable";
import Link from "next/link";
import { ROUTES } from "@/utils/constants";
import { ConfirmationDialog } from "@/components/dialog/Confirmation";
import { IReleaseFilter, ReleaseFilters } from "@/components/filters/ReleaseFilters";

interface Props {
  releasesData: PaginatedResponse<IRelease> | null;
}

function Main({ releasesData }: Props) {
  const { fetchReleases, approveRelease } = useRelease();

  const [releases, setReleases] = useState<PaginatedResponse<IRelease> | null>(releasesData);
  const [release, setRelease] = useState<IRelease | null>(null);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const [filters, setFilters] = useState<IReleaseFilter>({});

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const hasItem = Boolean(releases?.items?.length);

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  async function handleApproval() {
    if (!release) return;
    setApprovalLoading(true);
    const res = await approveRelease(release?.id);
    if (res) {
      setReload(!reload);
      setRelease(null);
    }
    setApprovalLoading(false);
  }

  useEffect(() => {
    async function getProperties() {
      const response = await fetchReleases({ ...filters, page: page + 1, limit });
      if (response) {
        setReleases(response);
      }
    }
    getProperties();
  }, [fetchReleases, filters, limit, page, reload]);

  return (
    <Box>
      <Stack mb="20" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle mr={"5px"}>
            <Box textTransform={"capitalize"}>Releases</Box>
          </PageTitle>
        </Stack>
        <ReleaseFilters filters={filters} setFilters={setFilters} />
      </Stack>

      <Stack alignItems={"flex-end"}>
        <Link href={`${ROUTES["/release"]}/configuration`}>
          <IconButton>
            <Gear />
          </IconButton>
        </Link>
      </Stack>

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={CreditCard}
              noItemCreatedDescription={`No releases to show`}
              noItemFoundDescription="No releases found"
              noItemCreated={Boolean(!releases?.items?.length && !releasesData?.items?.length)}
            />
          </Stack>
        ) : (
          <ReleaseTable
            data={releases}
            onLimitChange={onLimitChange}
            onPageChange={onPageChange}
            page={page}
            limit={limit}
            onRowClick={(data) => setRelease(data)}
          />
        )}
      </Box>
      <ConfirmationDialog
        message="Are you sure you want to approve this release?"
        isOpen={Boolean(release)}
        onClose={() => setRelease(null)}
        onConfirm={handleApproval}
        loading={approvalLoading}
      />
    </Box>
  );
}

export { Main };
