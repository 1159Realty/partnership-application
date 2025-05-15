"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Stack, TablePagination } from "@mui/material";
import { getDateTimeString } from "@/services/dateTime";
import { PaginatedResponse } from "@/lib/api/api.types";
import { StatusPill } from "../pills";
import { Check, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { formatCurrency } from "@/services/numbers";
import { CommissionStatus, ICommission } from "@/lib/api/commission/types";
import { getUserName } from "@/services/string";

interface Column {
  id: "status" | "commissionAmount" | "releaseDate" | "paymentDate" | "client";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "status", label: "Status", minWidth: 120 },
  { id: "commissionAmount", label: "Commission amount", minWidth: 170 },
  {
    id: "releaseDate",
    label: "Release date",
    minWidth: 170,
  },
  {
    id: "paymentDate",
    label: "Payment date",
    minWidth: 170,
  },
  {
    id: "client",
    label: "Client",
    minWidth: 170,
  },
];

interface Data {
  status: React.ReactNode;
  commissionAmount: string;
  releaseDate: string;
  paymentDate: string;
  client: string;
}

function createData(
  status: React.ReactNode,
  commissionAmount: string,
  releaseDate: string,
  paymentDate: string,
  client: string
  // action: React.ReactNode
): Data {
  return { status, commissionAmount, releaseDate, paymentDate, client };
}

interface CommissionTableProps {
  onRowClick?: (id: ICommission) => void;
  data: PaginatedResponse<ICommission> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function CommissionTable({ data, page, limit, onLimitChange, onPageChange }: CommissionTableProps) {
  function getStatus(status: CommissionStatus) {
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
    data?.items?.map((x) =>
      createData(
        getStatus(x?.status),
        formatCurrency(x?.amount),
        getDateTimeString(x?.releaseDate, "date-only") || "N/A",
        getDateTimeString(x?.invoice?.paymentDate, "date-only") || "N/A",
        getUserName(x?.invoice?.enrolment?.client)
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

export { CommissionTable };
