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
import { Check, CircleNotch, HourglassMedium } from "@phosphor-icons/react/dist/ssr";
import { getUserName } from "@/services/string";
import { Button } from "../buttons";
import { ISupport, SupportStatus } from "@/lib/api/support/types";

interface Column {
  id: "status" | "ticketNum" | "message" | "category" | "client" | "resolvedBy" | "dateCreated" | "dateUpdated" | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "status", label: "Status", minWidth: 120 },
  { id: "ticketNum", label: "Ticket number", minWidth: 170 },
  { id: "message", label: "Message", minWidth: 220 },
  {
    id: "category",
    label: "Category",
    minWidth: 170,
  },
  {
    id: "client",
    label: "Client",
    minWidth: 170,
  },
  {
    id: "resolvedBy",
    label: "Resolved by",
    minWidth: 170,
  },
  {
    id: "dateCreated",
    label: "Date created",
    minWidth: 170,
  },
  {
    id: "dateUpdated",
    label: "Date updated",
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
  ticketNum: string;
  message: string;
  category: string;
  client: string;
  resolvedBy: string;
  dateCreated: string;
  dateUpdated: string;
  action: React.ReactNode;
}

function createData(
  status: React.ReactNode,
  ticketNum: string,
  message: string,
  category: string,
  client: string,
  resolvedBy: string,
  dateCreated: string,
  dateUpdated: string,
  action: React.ReactNode
): Data {
  return { status, ticketNum, message, category, client, resolvedBy, dateCreated, dateUpdated, action };
}

interface Props {
  onRowClick?: (id: ISupport) => void;
  data: PaginatedResponse<ISupport> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function SupportManagementTable({ onRowClick, data, page, limit, onLimitChange, onPageChange }: Props) {
  function getStatus(status: SupportStatus) {
    if (status === "RESOLVED") {
      return (
        <StatusPill status="success">
          <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
            <Check weight="bold" /> <span>Resolved</span>
          </Stack>
        </StatusPill>
      );
    }
    if (status === "IN_PROGRESS") {
      return (
        <StatusPill status="alert">
          <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
            <HourglassMedium weight="bold" /> <span>In progress</span>
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
        `#${x?.ticketNum}`,
        x?.message || "N/A",
        x?.supportCategory?.name || "N/A",
        getUserName(x?.createdBy),
        getUserName(x?.resolvedBy),
        getDateTimeString(x?.createdAt, "date-only"),
        getDateTimeString(x?.createdAt, "date-only"),
        <Button
          disabled={x?.status === "RESOLVED"}
          onClick={() => onRowClick?.(x)}
          color="info"
          disableElevation={false}
          not_rounded
          padding="5px 12px"
        >
          Resolve
        </Button>
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

export { SupportManagementTable };
