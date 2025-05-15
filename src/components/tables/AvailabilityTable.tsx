"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { capitalize } from "@/services/string";
import { minutesToTimeRange } from "@/services/dateTime";
import { WEEKDAYS } from "@/utils/constants";
import { IAvailability } from "@/lib/api/availability/availability.types";
import { Button } from "../buttons";

interface Column {
  id: "day" | "time" | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "day", label: "Week day", minWidth: 170 },
  { id: "time", label: "Time", minWidth: 170 },
  {
    id: "action",
    label: "",
    minWidth: 170,
  },
];

interface Data {
  day: string;
  time: string;
  action: React.ReactNode;
}

function createData(day: string, time: string, action: React.ReactNode): Data {
  return { day, time, action };
}

interface AvailabilityTableProps {
  handleDelete?: (availability: IAvailability) => void;
  availabilities: IAvailability[] | null;
}

function AvailabilityTable({ handleDelete, availabilities }: AvailabilityTableProps) {
  function organizeByWeekday(availabilities: IAvailability[]): IAvailability[] {
    return availabilities.sort((a, b) => WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday));
  }
  const organizedAvailability = organizeByWeekday(availabilities || []);

  const rows = organizedAvailability?.map((a) =>
    createData(
      capitalize(a?.weekday),
      minutesToTimeRange(a.periods),
      <Button onClick={() => handleDelete?.(a)} color="error" disableElevation={false} not_rounded padding="5px 12px">
        Remove
      </Button>
    )
  );

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
                <TableRow hover role="checkbox" tabIndex={-1} key={availabilities?.[index]?.id}>
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
    </Paper>
  );
}

export { AvailabilityTable };
