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
import { ICampaign } from "@/lib/api/campaign/types";
import { getDateTimeString } from "@/services/dateTime";
import { capitalizeAndSpace, truncateString } from "@/services/string";

interface Column {
  id:
    | "name"
    | "type"
    | "design"
    | "subject"
    | "message"
    // | "recipientCount" | "successCount" | "pendingCount" | "failureCount"
    | "createdAt";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Campaign name", minWidth: 170 },
  { id: "type", label: "Campaign type", minWidth: 170 },
  {
    id: "subject",
    label: "Subject",
    minWidth: 170,
  },
  {
    id: "design",
    label: "Design",
    minWidth: 170,
  },
  {
    id: "message",
    label: "Message",
    minWidth: 170,
  },
  // {
  //   id: "recipientCount",
  //   label: "Total Recipient",
  //   minWidth: 170,
  // },
  // {
  //   id: "successCount",
  //   label: "Total delivered",
  //   minWidth: 170,
  // },
  // {
  //   id: "pendingCount",
  //   label: "Total pending",
  //   minWidth: 170,
  // },
  // {
  //   id: "failureCount",
  //   label: "Total failed",
  //   minWidth: 170,
  // },
  {
    id: "createdAt",
    label: "Date created",
    minWidth: 170,
  },
];

interface Data {
  name: string;
  type: string;
  design: string;
  subject: string;
  message: string;
  // recipientCount: string;
  // successCount: string;
  // pendingCount: string;
  // failureCount: string;
  createdAt: string;
}

function createData(
  name: string,
  type: string,
  design: string,
  subject: string,
  message: string,
  // recipientCount: string,
  // successCount: string,
  // pendingCount: string,
  // failureCount: string,
  createdAt: string
): Data {
  return {
    name,
    type,
    design,
    subject,
    message,
    //  recipientCount, successCount, pendingCount, failureCount,
    createdAt,
  };
}

interface CampaignHistoryTableProps {
  onRowClick?: (id: ICampaign) => void;
  data: PaginatedResponse<ICampaign> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function CampaignHistoryTable({ data, page, limit, onLimitChange, onPageChange }: CampaignHistoryTableProps) {
  const rows =
    data?.items?.map((x) =>
      createData(
        x?.name || "N/A",
        capitalizeAndSpace(x?.type) || "N/A",
        x?.design?.name || x?.template?.design?.name || "N/A",
        truncateString(x?.subject || x?.template?.subject) || "N/A",
        truncateString(x?.message || x?.template?.message) || "N/A",
        // addCommas(x?.recipientCount) || "N/A",
        // addCommas(x?.successCount) || "N/A",
        // addCommas(x?.pendingCount) || "N/A",
        // addCommas(x?.failureCount) || "N/A",
        getDateTimeString(x?.createdAt) || "N/A"
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

export { CampaignHistoryTable };
