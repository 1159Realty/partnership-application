"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { PaginatedResponse } from "@/lib/api/api.types";
import { Button } from "../buttons";
import { ISupportCategory } from "@/lib/api/support/types";

interface Column {
  id: "name" | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: "name",
    label: "Date updated",
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
  name: string;
  action: React.ReactNode;
}

function createData(name: string, action: React.ReactNode): Data {
  return { name, action };
}

interface Props {
  onRowClick?: (id: ISupportCategory) => void;
  data?: PaginatedResponse<ISupportCategory> | null;
  page?: number;
  limit?: number;
  onLimitChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange?: (_: unknown, newPage: number) => void;
}

function SupportCategoryTable({ onRowClick, data }: Props) {
  const rows =
    data?.items?.map((x) =>
      createData(
        x?.name || "N/A",
        <Button onClick={() => onRowClick?.(x)} color="error" disableElevation={false} not_rounded padding="5px 12px">
          Delete
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
    </Paper>
  );
}

export { SupportCategoryTable };
