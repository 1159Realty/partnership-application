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
import { IArea } from "@/lib/api/location/location.types";

interface Column {
  id: "area" | "lga" | "state";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "area", label: "Area", minWidth: 120 },
  { id: "lga", label: "Local government Area", minWidth: 170 },
  { id: "state", label: "State", minWidth: 170 },
];

interface Data {
  area: string;
  lga: string;
  state: string;
}

function createTableData(area: string, lga: string, state: string): Data {
  return { area, lga, state };
}

interface LocationTableProps {
  onRowClick?: (area: IArea) => void;
  data: PaginatedResponse<IArea> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function LocationTable({ onRowClick, data, page, limit, onLimitChange, onPageChange }: LocationTableProps) {
  const rows = data?.items?.map((x) => createTableData(x?.area, x?.lga?.lga, x?.state?.state)) || [];

  function handleClick(area?: IArea) {
    if (!area?.id) return;
    onRowClick?.(area);
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

export { LocationTable };
