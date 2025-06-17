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
import { capitalizeAndSpace, getUserName } from "@/services/string";
import { IRelease, ReleaseStatus } from "@/lib/api/release/types";
import { Button } from "../buttons";

interface Column {
  id: "status" | "type" | "releaseDate" | "releaseAmount" | "recipient" | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "status", label: "Status", minWidth: 120 },
  { id: "type", label: "Release type", minWidth: 170 },
  {
    id: "releaseDate",
    label: "Release date",
    minWidth: 170,
  },
  {
    id: "releaseAmount",
    label: "Release amount",
    minWidth: 170,
  },
  {
    id: "recipient",
    label: "Recipient",
    minWidth: 170,
  },
  {
    id: "action",
    label: "",
    minWidth: 170,
  },
];

interface Data {
  status: React.ReactNode;
  type: string;
  releaseDate: string;
  releaseAmount: string;
  recipient: string;
  action: React.ReactNode;
}

function createData(
  status: React.ReactNode,
  type: string,
  releaseDate: string,
  releaseAmount: string,
  recipient: string,
  action: React.ReactNode
): Data {
  return { status, type, releaseDate, releaseAmount, recipient, action };
}

interface ReleaseTableProps {
  onRowClick?: (id: IRelease) => void;
  data: PaginatedResponse<IRelease> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function ReleaseTable({ onRowClick, data, page, limit, onLimitChange, onPageChange }: ReleaseTableProps) {
  function getStatus(status: ReleaseStatus) {
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
        capitalizeAndSpace(x?.type),
        getDateTimeString(x?.releaseDate, "date-only") || "N/A",
        formatCurrency(x?.amount),
        getUserName(x?.type === "COMMISSION" ? x?.commission?.agent : x?.revocation?.client),

        <Button
          disabled={x?.status === "PAID"}
          onClick={() => onRowClick?.(x)}
          color="info"
          disableElevation={false}
          not_rounded
          padding="5px 12px"
        >
          Approve
        </Button>
      )
    ) || [];

  function handleClick(release: IRelease | null) {
    if (!release) return;
    onRowClick?.(release);
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
                <TableRow hover tabIndex={-1} key={data?.items?.[index]?.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleClick(data?.items?.[index] || null)}
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
        count={data?.totalItems || 0}
        rowsPerPage={limit}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onLimitChange}
      />
    </Paper>
  );
}

export { ReleaseTable };
