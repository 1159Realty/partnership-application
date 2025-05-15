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
import { getDateTimeString } from "@/services/dateTime";
import { capitalizeAndSpace, truncateString } from "@/services/string";
import { ICampaignTemplate } from "@/lib/api/campaign/types";

interface Column {
  id: "name" | "type" | "design" | "subject" | "message" | "createdAt";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Campaign name", minWidth: 170 },
  { id: "type", label: "Campaign type", minWidth: 170 },
  {
    id: "design",
    label: "Design",
    minWidth: 170,
  },
  {
    id: "subject",
    label: "Subject",
    minWidth: 170,
  },
  {
    id: "message",
    label: "Message",
    minWidth: 170,
  },
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
  createdAt: string;
}

function createData(name: string, type: string, design: string, subject: string, message: string, createdAt: string): Data {
  return { name, type, design, subject, message, createdAt };
}

interface Props {
  onRowClick?: (id: ICampaignTemplate) => void;
  data: PaginatedResponse<ICampaignTemplate> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function CampaignTemplateTable({ data, page, limit, onLimitChange, onPageChange, onRowClick }: Props) {
  const rows =
    data?.items?.map((x) =>
      createData(
        x?.name || "N/A",
        capitalizeAndSpace(x?.type) || "N/A",
        x?.design?.name || "N/A",
        truncateString(x?.subject) || "N/A",
        truncateString(x?.message) || "N/A",
        getDateTimeString(x?.createdAt) || "N/A"
      )
    ) || [];

  function handleClick(data?: ICampaignTemplate | null) {
    if (!data) return;
    onRowClick?.(data);
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

export { CampaignTemplateTable };
