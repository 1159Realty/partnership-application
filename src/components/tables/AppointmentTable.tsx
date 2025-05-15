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
import { AppointmentStatus, IAppointment } from "@/lib/api/appointment/appointment.types";
import { capitalize, capitalizeAndSpace } from "@/services/string";
import { getDateTimeString } from "@/services/dateTime";
import { PaginatedResponse } from "@/lib/api/api.types";
import { StatusPill } from "../pills";
import { Button } from "../buttons";

interface Column {
  id: "time" | "status" | "propertyName" | "note" | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "time", label: "Time", minWidth: 170 },
  { id: "status", label: "Status", minWidth: 170 },
  { id: "propertyName", label: "Property", minWidth: 170 },
  { id: "note", label: "Note", minWidth: 170 },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "right",
  },
];

interface Data {
  time: string;
  status: React.ReactNode;
  propertyName: string;
  note: string;
  action: React.ReactNode;
}

function createData(time: string, status: React.ReactNode, propertyName: string, note: string, action: React.ReactNode): Data {
  return { time, status, propertyName, note, action };
}

interface AppointmentTableProps {
  onRowClick: (id: string, status: AppointmentStatus) => void;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
  data: PaginatedResponse<IAppointment> | null;
  page: number;
  limit: number;
}

function AppointmentTable({ onRowClick, onLimitChange, onPageChange, page, limit, data }: AppointmentTableProps) {
  function getStatus(status: AppointmentStatus) {
    if (status === "CANCELLED") {
      return <StatusPill status="danger">{capitalizeAndSpace(status)}</StatusPill>;
    }
    if (status === "COMPLETED") {
      return <StatusPill status="success">{capitalizeAndSpace(status)}</StatusPill>;
    }
    if (status === "EXPIRED") {
      return <StatusPill status="neutral">{capitalizeAndSpace(status)}</StatusPill>;
    }

    return <StatusPill status="warning">{capitalizeAndSpace(status)}</StatusPill>;
  }
  const rows =
    data?.items?.map((a) =>
      createData(
        getDateTimeString(a?.time),
        getStatus(a?.status),
        capitalize(a?.property?.propertyName),
        a?.cancelledReason || "N/A",
        <Button
          disabled={a.status === "CANCELLED"}
          onClick={() => onRowClick(a?.id, "CANCELLED")}
          color="error"
          disableElevation={false}
          not_rounded
          padding="5px 12px"
        >
          Cancel
        </Button>
        // <Box>
        //   <Chip

        //     clickable={a.status !== "CANCELLED"}
        //     variant="outlined"
        //     color="error"
        //     label="Cancel"
        //     onDelete={() => onRowClick(a?.id, "CANCELLED")}
        //     onClick={() => onRowClick(a?.id, "CANCELLED")}
        //   />
        // </Box>
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

export { AppointmentTable };
