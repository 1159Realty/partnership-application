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
import { capitalize, getUserName } from "@/services/string";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IInterest } from "@/lib/api/interest/types";
import { Button } from "../buttons";

interface Column {
  id: "propertyName" | "client" | "contactedBy" | "action";
  label: string;
  minWidth?: number;
  align?: "right" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "propertyName", label: "Property", minWidth: 170 },
  { id: "client", label: "Client", minWidth: 170 },
  { id: "contactedBy", label: "Updated By", minWidth: 170 },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "center",
  },
];

interface Data {
  propertyName: string;
  client: string;
  contactedBy: string;
  action: React.ReactNode;
}

function createData(propertyName: string, client: string, contactedBy: string, action: React.ReactNode): Data {
  return { propertyName, client, contactedBy, action };
}

interface TableProps {
  onRowClick: (id: IInterest) => void;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
  data: PaginatedResponse<IInterest> | null;
  page: number;
  limit: number;
}

function InterestTable({ onRowClick, onLimitChange, onPageChange, page, limit, data }: TableProps) {
  const rows =
    data?.items?.map((x) =>
      createData(
        capitalize(x?.property?.propertyName),
        getUserName(x?.createdBy),
        getUserName(x?.contactedBy),

        <Button
          disabled={Boolean(x?.contactedBy)}
          onClick={() => onRowClick(x)}
          color="info"
          disableElevation={false}
          not_rounded
          padding="5px 12px"
        >
          Contacted
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
                <TableRow hover role="checkbox" tabIndex={-1} key={data?.items?.[index]?.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
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

export { InterestTable };
