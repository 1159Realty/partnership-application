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
import { getDateTimeString } from "@/services/dateTime";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IDocumentGroup } from "@/lib/api/document/document.types";
import { getUserName } from "@/services/string";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";

interface DocumentTableColumn {
  id: "name" | "description" | "client" | "property" | "createdBy" | "dateCreated" | "updatedBy" | "dateUpdated";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const documentTableColumns: readonly DocumentTableColumn[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 220 },
  { id: "client", label: "Client", minWidth: 170 },
  { id: "property", label: "Property", minWidth: 170 },
  { id: "createdBy", label: "Created by", minWidth: 170 },
  { id: "dateCreated", label: "Created on", minWidth: 170 },
  { id: "updatedBy", label: "Updated by", minWidth: 170 },
  { id: "dateUpdated", label: "Updated on", minWidth: 170 },
];

interface DocumentTableData {
  name: string;
  description: string;
  client: string;
  property: string;
  createdBy: string;
  dateCreated: string;
  updatedBy: string;
  dateUpdated: string;
}

function createDocumentTableData(
  name: string,
  description: string,
  client: string,
  property: string,
  createdBy: string,
  dateCreated: string,
  updatedBy: string,
  dateUpdated: string
): DocumentTableData {
  return { name, description, client, property, createdBy, dateCreated, updatedBy, dateUpdated };
}

interface DocumentTableProps {
  onRowClick?: (id: string) => void;
  data: PaginatedResponse<IDocumentGroup> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function DocumentTable({ data, page, limit, onLimitChange, onPageChange }: DocumentTableProps) {
  const router = useRouter();

  const rows =
    data?.items?.map((x) =>
      createDocumentTableData(
        x?.title,
        x?.description,
        getUserName(x?.client),
        x?.property?.propertyName || "N/A",
        getUserName(x?.createdBy),
        getDateTimeString(x?.createdAt),
        getUserName(x?.updatedBy),
        getDateTimeString(x?.updatedAt)
      )
    ) || [];

  function handleRowClick(d: IDocumentGroup | null) {
    if (!d?.id) return;
    router.push(`${ROUTES["/documents"]}/${d.id}`);
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {documentTableColumns.map((column) => (
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
                  {documentTableColumns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleRowClick(data?.items?.[index] || null)}
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

export { DocumentTable };
