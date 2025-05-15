"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TablePagination } from "@mui/material";
import { PaginatedResponse } from "@/lib/api/api.types";
import { addCommas, formatCurrency } from "@/services/numbers";
import { IAgentPerformanceReport } from "@/lib/api/commission/types";
import { getUserName } from "@/services/string";

interface Column {
  id:
    | "name"
    | "email"
    | "clientsTotal"
    | "totalRevenueAmount"
    | "pendingRevenueAmount"
    | "receivedRevenueAmount"
    | "totalCommissionAmount"
    | "pendingCommissionAmount"
    | "receivedCommissionAmount";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  { id: "clientsTotal", label: "Clients total", minWidth: 170 },
  {
    id: "totalRevenueAmount",
    label: "Revenue generated",
    minWidth: 170,
  },
  {
    id: "pendingRevenueAmount",
    label: "Pending revenue",
    minWidth: 170,
  },
  {
    id: "receivedRevenueAmount",
    label: "Collected revenue",
    minWidth: 170,
  },
  {
    id: "totalCommissionAmount",
    label: "Commissions total",
    minWidth: 170,
  },
  {
    id: "pendingCommissionAmount",
    label: "Pending commissions",
    minWidth: 170,
  },
  {
    id: "receivedCommissionAmount",
    label: "Collected commissions",
    minWidth: 170,
  },
];

interface Data {
  name: string;
  email: string;
  clientsTotal: string;
  totalRevenueAmount: string;
  pendingRevenueAmount: string;
  receivedRevenueAmount: string;
  totalCommissionAmount: string;
  pendingCommissionAmount: string;
  receivedCommissionAmount: string;
}

function createData(
  name: string,
  email: string,
  clientsTotal: string,
  totalRevenueAmount: string,
  pendingRevenueAmount: string,
  receivedRevenueAmount: string,
  totalCommissionAmount: string,
  pendingCommissionAmount: string,
  receivedCommissionAmount: string
): Data {
  return {
    name,
    email,
    clientsTotal,
    totalRevenueAmount,
    pendingRevenueAmount,
    receivedRevenueAmount,
    totalCommissionAmount,
    pendingCommissionAmount,
    receivedCommissionAmount,
  };
}

interface Props {
  onRowClick?: (id: IAgentPerformanceReport) => void;
  data: PaginatedResponse<IAgentPerformanceReport> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function AgentPerformanceTable({ data, page, limit, onLimitChange, onPageChange }: Props) {
  const rows =
    data?.items?.map((x) =>
      createData(
        getUserName(x?.agent),
        x?.agent?.email,
        addCommas(x?.clientsTotal),
        formatCurrency(x?.totalRevenueAmount),
        formatCurrency(x?.pendingRevenueAmount),
        formatCurrency(x?.receivedRevenueAmount),
        formatCurrency(x?.totalCommissionAmount),
        formatCurrency(x?.pendingCommissionAmount),
        formatCurrency(x?.receivedCommissionAmount)
      )
    ) || [];

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
                <TableRow hover tabIndex={-1} key={data?.items?.[index]?.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell sx={{ cursor: "pointer" }} key={column.id} align={column.align}>
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
        count={data?.totalItems || 0}
        rowsPerPage={limit}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onLimitChange}
      />
    </Paper>
  );
}

export { AgentPerformanceTable };
