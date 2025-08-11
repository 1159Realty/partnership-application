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
import { PaginatedResponse } from "@/lib/api/api.types";
import { getUserName } from "@/services/string";
import { EnrollmentStatus, IEnrollment } from "@/lib/api/enrollment/types";
import { addCommas, formatCurrency } from "@/services/numbers";
import { getDateTimeString } from "@/services/dateTime";
import { StatusPill } from "../pills";
import { Check, CircleNotch, Snowflake, Warning } from "@phosphor-icons/react/dist/ssr";

interface Column {
  id:
    | "client"
    | "property"
    | "status"
    | "price"
    | "totalAmount"
    | "balanceLeft"
    | "landSize"
    | "installmentDuration"
    | "outrightPayment"
    | "plotId"
    | "agent"
    | "createdOn";

  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "client", label: "Client", minWidth: 170 },
  { id: "property", label: "Property", minWidth: 170 },
  { id: "status", label: "Status", minWidth: 170 },
  { id: "price", label: "Price", minWidth: 170 },
  { id: "totalAmount", label: "Total Amount", minWidth: 170 },
  { id: "balanceLeft", label: "Balance Left", minWidth: 170 },
  { id: "landSize", label: "Land Size", minWidth: 170 },
  { id: "installmentDuration", label: "Installment Duration", minWidth: 170 },
  { id: "outrightPayment", label: "Outright Payment", minWidth: 170 },
  { id: "plotId", label: "Plot Id", minWidth: 170 },
  { id: "agent", label: "Agent", minWidth: 170 },
  { id: "createdOn", label: "Created On", minWidth: 170 },
];

interface Data {
  client: string;
  property: string;
  status: React.ReactNode;
  price: string;
  totalAmount: string;
  balanceLeft: string;
  landSize: string;
  installmentDuration: string;
  outrightPayment: string;
  plotId: string;
  agent: string;
  createdOn: string;
}
function createTableData(
  client: string,
  property: string,
  status: React.ReactNode,
  price: string,
  totalAmount: string,
  balanceLeft: string,
  landSize: string,
  installmentDuration: string,
  outrightPayment: string,
  plotId: string,
  agent: string,
  createdOn: string
): Data {
  return {
    client,
    property,
    status,
    price,
    totalAmount,
    balanceLeft,
    landSize,
    installmentDuration,
    outrightPayment,
    plotId,
    agent,
    createdOn,
  };
}

interface Props {
  onRowClick?: (enrollment?: IEnrollment | null) => void;
  data: PaginatedResponse<IEnrollment> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function EnrollmentsTable({ data, page, limit, onLimitChange, onPageChange, onRowClick }: Props) {
  function getInvoiceStatus(status: EnrollmentStatus) {
    if (status === "FREEZE") {
      return (
        <StatusPill status="neutral">
          <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
            <Snowflake weight="bold" /> <span>Frozen</span>
          </Stack>
        </StatusPill>
      );
    }
    if (status === "CANCELLED") {
      return (
        <StatusPill status="danger">
          <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
            <Warning weight="bold" /> <span>Cancelled</span>
          </Stack>
        </StatusPill>
      );
    }
    if (status === "COMPLETED") {
      return (
        <StatusPill status="success">
          <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
            <Check weight="bold" /> <span>Completed</span>
          </Stack>
        </StatusPill>
      );
    }
    return (
      <StatusPill status="warning">
        <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
          <CircleNotch weight="bold" /> <span>Ongoing</span>
        </Stack>
      </StatusPill>
    );
  }
  const rows =
    data?.items?.map((x) =>
      createTableData(
        getUserName(x.client),
        x?.property?.propertyName || "N/A",
        getInvoiceStatus(x?.status),
        formatCurrency(x?.price),
        formatCurrency(x?.totalAmount),
        formatCurrency(x?.balanceLeft),
        `${addCommas(x?.landSize) || "-"} ${x?.property?.category === "HOSTEL" ? "UNIT(s)" : "SQM(s)"}`,
        `${addCommas(x.installmentDuration) || "-"} Month(s)`,
        x.outrightPayment ? "Yes" : "No",
        x?.plotId || "N/A",
        getUserName(x.agent),
        getDateTimeString(x.createdAt, "date-only")
      )
    ) || [];

  function handleClick(enrollment?: IEnrollment | null) {
    onRowClick?.(enrollment);
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
                        onClick={() => handleClick(data?.items?.[index])}
                        sx={{ cursor: "pointer" }}
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

export { EnrollmentsTable };
