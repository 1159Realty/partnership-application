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

interface Column {
  id: "name" | "email" | "phoneNumber" | "state" | "gender" | "trafficSource";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  { id: "phoneNumber", label: "Phone number", minWidth: 170 },
  { id: "state", label: "State", minWidth: 170 },
  { id: "gender", label: "Gender", minWidth: 170 },
  { id: "trafficSource", label: "Source", minWidth: 170 },
];

interface Data {
  name: string;
  email: string;
  phoneNumber: string;
  state: string;
  gender: string;
  trafficSource: string;
}

function createTableData(
  name: string,
  email: string,
  phoneNumber: string,
  state: string,
  gender: string,
  trafficSource: string
): Data {
  return { name, email, phoneNumber, state, gender, trafficSource };
}

interface Props {
  onRowClick?: (user: User) => void;
  data: PaginatedResponse<User> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function ClientTable({ data, page, limit, onLimitChange, onPageChange }: Props) {
  // const router = useRouter();

  const rows =
    data?.items?.map((x) =>
      createTableData(
        getUserName(x),
        x?.email,
        x?.phoneNumber || "N/A",
        x?.state?.state || "N/A",
        capitalizeAndSpace(x?.gender || "") || "N/A",
        capitalizeAndSpace(x?.trafficSource || "") || "N/A"
      )
    ) || [];

  // function handleClick(user?: User | null) {
  //   if (!user?.id) return;
  //   router.push(`${ROUTES["/clients"]}/${user.id}`);
  // }

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
                        // onClick={() => handleClick(data?.items?.[index])}
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

export { ClientTable };
