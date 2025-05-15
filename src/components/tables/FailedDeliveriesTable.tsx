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
import { capitalizeAndSpace, getUserName } from "@/services/string";
import { IFailedCampaignDelivery } from "@/lib/api/campaign/types";

interface Column {
  id: "campaign" | "name" | "email" | "phoneNumber" | "state" | "gender";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "campaign", label: "Name", minWidth: 170 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  { id: "phoneNumber", label: "Phone number", minWidth: 170 },
  { id: "state", label: "State", minWidth: 170 },
  { id: "gender", label: "Gender", minWidth: 170 },
];

interface Data {
  campaign: string;
  name: string;
  email: string;
  phoneNumber: string;
  state: string;
  gender: string;
}

function createTableData(
  campaign: string,
  name: string,
  email: string,
  phoneNumber: string,
  state: string,
  gender: string
): Data {
  return { campaign, name, email, phoneNumber, state, gender };
}

interface Props {
  data: PaginatedResponse<IFailedCampaignDelivery> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function FailedDeliveriesTable({ data, page, limit, onLimitChange, onPageChange }: Props) {
  // const router = useRouter();

  const rows =
    data?.items?.map((x) =>
      createTableData(
        x?.campaign?.name || "N/A",
        getUserName(x?.recipient),
        x?.recipient?.email,
        x?.recipient?.phoneNumber || "N/A",
        x?.recipient?.state?.state || "N/A",
        capitalizeAndSpace(x?.recipient?.gender || "") || "N/A"
      )
    ) || [];

  // function handleClick(user?: IFailedCampaignDelivery | null) {
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

export { FailedDeliveriesTable };
