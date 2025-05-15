"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Stack, TablePagination } from "@mui/material";
import { getDateTimeString } from "@/services/dateTime";
import { IInvoice, InvoiceStatus } from "@/lib/api/invoice/invoice.types";
import { PaginatedResponse } from "@/lib/api/api.types";
import { StatusPill } from "../pills";
import { Check, CircleNotch, FilePdf, Warning } from "@phosphor-icons/react/dist/ssr";
import { addCommas } from "@/services/numbers";
import { COLORS } from "@/utils/colors";

interface Column {
  id: "status" | "amount" | "dueDate" | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "status", label: "Status", minWidth: 120 },
  { id: "amount", label: "Amount", minWidth: 170 },
  {
    id: "dueDate",
    label: "Due date",
    minWidth: 170,
  },
  {
    id: "action",
    label: "",
    minWidth: 170,
    align: "right",
  },
];

interface Data {
  status: React.ReactNode;
  amount: string;
  dueDate: string;
  action: React.ReactNode;
}

function createData(status: React.ReactNode, amount: string, dueDate: string, action: React.ReactNode): Data {
  return { status, amount, dueDate, action };
}

interface InvoiceTableProps {
  onRowClick?: (id: IInvoice) => void;
  invoices: PaginatedResponse<IInvoice> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function InvoiceTable({ onRowClick, invoices, page, limit, onLimitChange, onPageChange }: InvoiceTableProps) {
  function getInvoiceStatus(status: InvoiceStatus) {
    if (status === "OVERDUE") {
      return (
        <StatusPill status="danger">
          <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
            <Warning weight="bold" /> <span>Overdue</span>
          </Stack>
        </StatusPill>
      );
    }
    if (status === "PAID") {
      return (
        <StatusPill status="success">
          <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
            <Check weight="bold" /> <span>Paid</span>
          </Stack>
        </StatusPill>
      );
    }
    return (
      <StatusPill status="warning">
        <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
          <CircleNotch weight="bold" /> <span>Pending</span>
        </Stack>
      </StatusPill>
    );
  }

  const rows =
    invoices?.items?.map((i) =>
      createData(
        getInvoiceStatus(i?.status),
        `₦${addCommas(i?.amount)}`,
        getDateTimeString(i?.dueDate, "date-only"),
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"10px"}
          width={"fit-content"}
          p="10px"
          borderRadius={"10px"}
          bgcolor={COLORS.gray100}
        >
          <FilePdf size={20} /> <Box>Invoice.pdf</Box>
        </Stack>
      )
    ) || [];

  function handleClick(invoice: IInvoice | null) {
    if (!invoice) return;
    onRowClick?.(invoice);
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  sx={{ bgcolor: "whitesmoke" }}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <TableRow hover tabIndex={-1} key={invoices?.items?.[index]?.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleClick(invoices?.items?.[index] || null)}
                        key={column.id}
                        align={column.align}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={invoices?.totalItems || 0}
        rowsPerPage={limit}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onLimitChange}
      />
    </Paper>
  );
}

export { InvoiceTable };
