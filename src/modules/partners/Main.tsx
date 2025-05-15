"use client";

import { PaginatedResponse } from "@/lib/api/api.types";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Handshake } from "@phosphor-icons/react/dist/ssr";
import { PageTitle } from "@/components/typography";
import { usePartners } from "@/lib/api/partners/usePartners";
import { IPartner, partnersArr, PartnerStatus } from "@/lib/api/partners/types";
import { RoundedSelect, Search } from "@/components/Inputs";
import { useDebounce } from "use-debounce";
import { PartnersTable } from "@/components/tables/PartnersTable";
import { ConfirmationDialog } from "@/components/dialog/Confirmation";
import { capitalizeAndSpace } from "@/services/string";
import { FilterFlexWrappers } from "@/components/filters/filters.styles";
import { AgentType } from "@/lib/api/user/user.types";

interface Props {
  partnersData: PaginatedResponse<IPartner> | null;
}

function Main({ partnersData }: Props) {
  const { fetchPartners, approvePartnership, declinePartnership } = usePartners();

  const [partners, setPartners] = useState(partnersData);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const [statusFilter, setStatusFilter] = useState<PartnerStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  const [reload, setReload] = useState(false);

  const [privateApprovalId, setPrivateApprovalId] = useState<string | null>(null);
  const [loadingPrivateApproval, setLoadingPrivateApproval] = useState(false);

  const [companyApprovalId, setCompanyApprovalId] = useState<string | null>(null);
  const [loadingCompanyApproval, setLoadingCompanyApproval] = useState(false);

  const [declineId, setDeclineId] = useState<string | null>(null);
  const [loadingDecline, setLoadingDecline] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 700);

  const hasItem = Boolean(partners?.items?.length);

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  async function onRowClick(data: IPartner, status: PartnerStatus, agentType: AgentType = "PRIVATE") {
    if (!data) return;

    if (status === "APPROVED") {
      if (agentType === "PRIVATE") {
        setPrivateApprovalId(data?.id);
      } else {
        setCompanyApprovalId(data?.id);
      }
    } else {
      setDeclineId(data?.id);
    }
  }

  async function handlePrivateApproval() {
    if (!privateApprovalId) return;

    setLoadingPrivateApproval(true);
    const res = await approvePartnership(privateApprovalId, "PRIVATE");
    if (res) {
      setReload(!reload);
      setPrivateApprovalId(null);
    }
    setLoadingPrivateApproval(false);
    if (res) {
    }
  }

  async function handleCompanyApproval() {
    if (!companyApprovalId) return;

    setLoadingCompanyApproval(true);
    const res = await approvePartnership(companyApprovalId, "COMPANY");
    if (res) {
      setReload(!reload);
      setCompanyApprovalId(null);
    }
    setLoadingCompanyApproval(false);
    if (res) {
    }
  }

  async function handleDecline() {
    if (!declineId) return;

    setLoadingDecline(true);
    const res = await declinePartnership(declineId);
    if (res) {
      setReload(!reload);
      setDeclineId(null);
    }
    setLoadingDecline(false);
  }

  useEffect(() => {
    async function get() {
      const response = await fetchPartners({
        page: page + 1,
        limit,
        status: statusFilter || undefined,
        keyword: debouncedSearchQuery,
      });
      if (response) {
        setPartners(response);
      }
    }
    get();
  }, [fetchPartners, statusFilter, limit, page, debouncedSearchQuery, reload]);

  return (
    <Box>
      <Stack mb="32px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle mr={"5px"}>
            <Box textTransform={"capitalize"}>Partners</Box>
          </PageTitle>
        </Stack>
      </Stack>

      <FilterFlexWrappers>
        <Box flexGrow={1} width={"100%"} maxWidth={450}>
          <Search
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </Box>

        <Box maxWidth={"200px"} width={"100%"}>
          <RoundedSelect
            label="Role filter"
            items={[
              ...partnersArr.map((x) => {
                return {
                  label: capitalizeAndSpace(x),
                  id: x,
                };
              }),
              { label: "All", id: "" },
            ]}
            onChange={(e) => {
              setStatusFilter(e.target.value as PartnerStatus);
            }}
            value={statusFilter}
          />
        </Box>
      </FilterFlexWrappers>

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={Handshake}
              noItemCreatedDescription={`No partners to show`}
              noItemFoundDescription="No partners found"
              noItemCreated={Boolean(!partners?.items?.length && !partnersData?.items?.length)}
            />
          </Stack>
        ) : (
          <Box>
            <PartnersTable
              data={partners}
              onLimitChange={onLimitChange}
              onRowClick={onRowClick}
              onPageChange={onPageChange}
              page={page}
              limit={limit}
            />
          </Box>
        )}

        <ConfirmationDialog
          message="Are you sure you want to make this user a private agent?"
          isOpen={Boolean(privateApprovalId)}
          onClose={() => setPrivateApprovalId(null)}
          onConfirm={handlePrivateApproval}
          loading={loadingPrivateApproval}
        />

        <ConfirmationDialog
          message="Are you sure you want to make this user a company agent?"
          isOpen={Boolean(companyApprovalId)}
          onClose={() => setCompanyApprovalId(null)}
          onConfirm={handleCompanyApproval}
          loading={loadingCompanyApproval}
        />

        <ConfirmationDialog
          message="Are you sure you want to decline this partnership request?"
          isOpen={Boolean(declineId)}
          onClose={() => setDeclineId(null)}
          onConfirm={handleDecline}
          loading={loadingDecline}
        />
      </Box>
    </Box>
  );
}

export { Main };
