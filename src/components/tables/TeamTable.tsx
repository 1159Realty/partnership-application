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
import { User } from "@/lib/api/user/user.types";
import { capitalizeAndSpace, getUserName } from "@/services/string";
import { getHasRoleUpdatePermission, getRole } from "@/lib/session/roles";
import { useAlertContext } from "@/contexts/AlertContext";
import { useUserContext } from "@/contexts/UserContext";

interface Column {
  id:
    | "name"
    | "role"
    | "assignedBy"
    | "email"
    | "phoneNumber"
    | "country"
    | "state"
    | "residentialAddress"
    | "gender"
    | "trafficSource";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "role", label: "Role", minWidth: 170 },
  { id: "assignedBy", label: "Assigned by", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  { id: "phoneNumber", label: "Phone number", minWidth: 170 },
  { id: "country", label: "Country", minWidth: 170 },
  { id: "state", label: "State", minWidth: 170 },
  { id: "residentialAddress", label: "Address", minWidth: 170 },
  { id: "gender", label: "Gender", minWidth: 170 },
  { id: "trafficSource", label: "Source", minWidth: 170 },
];

interface Data {
  name: string;
  role: string;
  assignedBy: string;
  email: string;
  phoneNumber: string;
  country: string;
  state: string;
  residentialAddress: string;
  gender: string;
  trafficSource: string;
}

function createTableData(
  name: string,
  role: string,
  assignedBy: string,
  email: string,
  phoneNumber: string,
  country: string,
  state: string,
  residentialAddress: string,
  gender: string,
  trafficSource: string
): Data {
  return { name, role, assignedBy, email, phoneNumber, country, state, residentialAddress, gender, trafficSource };
}

interface Props {
  onRowClick?: (user: User) => void;
  data: PaginatedResponse<User> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function TeamTable({ onRowClick, data, page, limit, onLimitChange, onPageChange }: Props) {
  const { setAlert } = useAlertContext();
  const { userData } = useUserContext();

  const rows =
    data?.items?.map((x) =>
      createTableData(
        getUserName(x),
        capitalizeAndSpace(getRole(x?.roleId)),
        getUserName(x?.roleAssignedBy),
        x?.email,
        x?.phoneNumber || "N/A",
        x?.country || "N/A",
        x?.state?.state || "N/A",
        x?.residentialAddress || "N/A",
        capitalizeAndSpace(x?.gender || "") || "N/A",
        capitalizeAndSpace(x?.trafficSource || "") || "N/A"
      )
    ) || [];

  function handleClick(user?: User) {
    if (!user?.id) return;

    const isAuthorized = getHasRoleUpdatePermission(userData?.roleId, user?.roleId);
    if (!isAuthorized) {
      setAlert({
        message: "Access denied",
        show: true,
        severity: "error",
      });
      return;
    }

    onRowClick?.(user);
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

export { TeamTable };
