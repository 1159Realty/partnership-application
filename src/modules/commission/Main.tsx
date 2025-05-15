"use client";

import { PaginatedResponse } from "@/lib/api/api.types";
import { Box, Grid2, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { CurrencyNgn } from "@phosphor-icons/react/dist/ssr";
import { PageTitle } from "@/components/typography";
import { IInvoiceFilter } from "@/components/filters/InvoiceFilters";
import { getClientSession } from "@/lib/session/client";
import { useUserContext } from "@/contexts/UserContext";
import { getRole } from "@/lib/session/roles";
import { StatCard } from "@/components/cards/StatCard";
import { ICommission, ICommissionTotal } from "@/lib/api/commission/types";
import { useCommission } from "@/lib/api/commission/useCommission";
import { CommissionTable } from "@/components/tables/CommissionTable";
import { addCommas, formatCurrency } from "@/services/numbers";
import { CommissionFilters } from "@/components/filters/CommissionFilters";

interface Props {
  commissionsData: PaginatedResponse<ICommission> | null;
  commissionTotalData: ICommissionTotal | null;
}

function Main({ commissionsData, commissionTotalData }: Props) {
  const { userData } = useUserContext();

  const { fetchCommissions, fetchCommissionTotal } = useCommission();

  const [commissions, setCommissions] = useState<PaginatedResponse<ICommission> | null>(commissionsData);
  const [commissionTotal, setCommissionTotal] = useState(commissionTotalData);

  const [filters, setFilters] = useState<IInvoiceFilter>({});

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const hasItem = Boolean(commissions?.items?.length);
  const role = getRole(userData?.roleId);
  const isModerator = !(role === "agent" || role === "client");

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  useEffect(() => {
    async function getProperties() {
      const session = getClientSession();
      const response = await fetchCommissions({ ...filters, agentId: session?.user?.id, page: page + 1, limit });
      if (response) {
        setCommissions(response);
      }
    }
    getProperties();
  }, [fetchCommissions, filters, isModerator, limit, page]);

  useEffect(() => {
    async function get() {
      const response = await fetchCommissionTotal();
      if (response) {
        setCommissionTotal(response);
      }
    }
    get();
  }, [fetchCommissionTotal]);

  return (
    <Box>
      <Stack mb="32px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle mr={"5px"}>
            <Box textTransform={"capitalize"}>Commissions</Box>
          </PageTitle>
        </Stack>
        <CommissionFilters filters={filters} setFilters={setFilters} />
      </Stack>

      <Grid2 container spacing={{ xxs: 2, md: 3 }}>
        <Grid2 size={{ xxs: 6, md: 4, lg: 3 }}>
          <StatCard label="Total Generated" stat={addCommas(commissionTotal?.totalCommissionItems || 0)} />
        </Grid2>
        <Grid2 size={{ xxs: 6, md: 4, lg: 3 }}>
          <StatCard label="Commission Total " stat={formatCurrency(commissionTotal?.totalCommissionAmount || 0)} />
        </Grid2>

        <Grid2 size={{ xxs: 6, md: 4, lg: 3 }}>
          <StatCard label="Total Paid" stat={formatCurrency(commissionTotal?.totalPaidAmount || 0)} />
        </Grid2>

        <Grid2 size={{ xxs: 6, md: 4, lg: 3 }}>
          <StatCard label="Total Pending" stat={formatCurrency(commissionTotal?.totalPendingAmount || 0)} />
        </Grid2>
      </Grid2>

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={CurrencyNgn}
              noItemCreatedDescription={`No commissions to show`}
              noItemFoundDescription="No commissions found"
              noItemCreated={Boolean(!commissions?.items?.length && !commissionsData?.items?.length)}
            />
          </Stack>
        ) : (
          <Box>
            <CommissionTable
              data={commissions}
              onLimitChange={onLimitChange}
              onPageChange={onPageChange}
              page={page}
              limit={limit}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export { Main };
