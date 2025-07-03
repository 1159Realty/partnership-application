"use client";

import { PaginatedResponse } from "@/lib/api/api.types";
import { Box, Grid2, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Receipt } from "@phosphor-icons/react/dist/ssr";
import { IInvoice, InvoiceTotal } from "@/lib/api/invoice/invoice.types";
import { PageTitle } from "@/components/typography";
import { IInvoiceFilter, InvoiceFilters } from "@/components/filters/InvoiceFilters";
import { useInvoice } from "@/lib/api/invoice/useInvoice";
import { getClientSession } from "@/lib/session/client";
import { InvoiceTemplate } from "@/components/pdfTemplate/invoice";
import { InvoiceTable } from "@/components/tables/InvoiceTable";
import { useUserContext } from "@/contexts/UserContext";
import { getIsModerator } from "@/lib/session/roles";
import { ModeratorInvoiceTable } from "@/components/tables/ModeratorInvoiceTable";
import { InvoiceDetail } from "./InvoiceDetail";
import { StatCard } from "@/components/cards/StatCard";
import { formatCurrency } from "@/services/numbers";
import { formatAsIsoString } from "@/services/dateTime";

interface Props {
  invoicesData: PaginatedResponse<IInvoice> | null;
  invoiceTotalData: InvoiceTotal | null;
}

function Main({ invoicesData, invoiceTotalData }: Props) {
  const { userData } = useUserContext();

  const { fetchInvoices, fetchInvoiceTotal } = useInvoice();

  const [invoices, setInvoices] = useState(invoicesData);
  const [invoiceTotal, setInvoiceTotal] = useState(invoiceTotalData);

  const [filters, setFilters] = useState<IInvoiceFilter>({});

  const [currentInvoice, setCurrentInvoice] = useState<IInvoice | null>(null);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const hasItem = Boolean(invoices?.items?.length);
  const isModerator = getIsModerator(userData?.roleId);

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }
  function onRowClick(invoice: IInvoice) {
    setCurrentInvoice(invoice);
  }

  function handleUpdateInvoices(invoice?: IInvoice | null) {
    setInvoices((prev) => {
      return {
        ...prev!,
        items: prev!.items.map((x) => {
          if (x.id === invoice?.id) {
            return { ...x, status: "PAID", paymentDate: formatAsIsoString(new Date()) };
          }
          return x;
        }),
      };
    });

    setInvoiceTotal((prev) => {
      return {
        ...prev!,
        totalPaidAmount: prev!.totalPaidAmount + (invoice?.totalAmount || 0),
        totalPendingAmount: prev!.totalPendingAmount - (invoice?.totalAmount || 0),
      };
    });
  }

  useEffect(() => {
    async function getProperties() {
      const session = getClientSession();
      const response = isModerator
        ? await fetchInvoices({ ...filters, page, limit })
        : await fetchInvoices({ ...filters, limit, page: page + 1, userId: session?.user?.id });
      if (response) {
        setInvoices(response);
      }
    }
    getProperties();
  }, [fetchInvoices, filters, isModerator, limit, page]);

  useEffect(() => {
    async function getInvoiceTotal() {
      const response = await fetchInvoiceTotal();
      if (response) {
        setInvoiceTotal(response);
      }
    }
    getInvoiceTotal();
  }, [fetchInvoiceTotal]);

  return (
    <Box>
      <Stack mb="32px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle mr={"5px"}>
            <Box textTransform={"capitalize"}>Invoices</Box>
          </PageTitle>
        </Stack>
        <InvoiceFilters filters={filters} setFilters={setFilters} />
      </Stack>

      {!isModerator && (
        <Grid2 container spacing={{ xxs: 2, md: 3 }}>
          <Grid2 size={{ xxs: 6, md: 4, lg: 3 }}>
            <StatCard label="Invoice Total" stat={formatCurrency(invoiceTotal?.totalInvoiceAmount || 0)} />
          </Grid2>
          <Grid2 size={{ xxs: 6, md: 4, lg: 3 }}>
            <StatCard label="Total Paid" stat={formatCurrency(invoiceTotal?.totalPaidAmount || 0)} />
          </Grid2>
          <Grid2 size={{ xxs: 6, md: 4, lg: 3 }}>
            <StatCard label="Total Pending" stat={formatCurrency(invoiceTotal?.totalPendingAmount || 0)} />
          </Grid2>
          <Grid2 size={{ xxs: 6, md: 4, lg: 3 }}>
            <StatCard label="Total Overdue" stat={formatCurrency(invoiceTotal?.totalOverdueAmount || 0)} />
          </Grid2>
        </Grid2>
      )}

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={Receipt}
              noItemCreatedDescription={`No invoice to show`}
              noItemFoundDescription="No invoice found"
              noItemCreated={Boolean(!invoices?.items?.length && !invoicesData?.items?.length)}
            />
          </Stack>
        ) : (
          <Box>
            {isModerator ? (
              <ModeratorInvoiceTable
                data={invoices}
                onLimitChange={onLimitChange}
                onRowClick={onRowClick}
                onPageChange={onPageChange}
                page={page}
                limit={limit}
              />
            ) : (
              <InvoiceTable
                invoices={invoices}
                onLimitChange={onLimitChange}
                onRowClick={onRowClick}
                onPageChange={onPageChange}
                page={page}
                limit={limit}
              />
            )}

            <InvoiceTemplate
              makePayment={handleUpdateInvoices}
              isOpen={Boolean(currentInvoice && !isModerator)}
              onClose={() => setCurrentInvoice(null)}
              invoice={currentInvoice}
            />
            <InvoiceDetail
              invoice={currentInvoice}
              isOpen={Boolean(currentInvoice && isModerator)}
              onClose={() => setCurrentInvoice(null)}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export { Main };
