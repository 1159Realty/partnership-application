"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Stack, TablePagination } from "@mui/material";
import { PaginatedResponse } from "@/lib/api/api.types";
import { capitalizeAndSpace, getUserName } from "@/services/string";
import { Button } from "../buttons";
import { IPartner, PartnerStatus } from "@/lib/api/partners/types";
import { Building, User } from "@phosphor-icons/react/dist/ssr";
import { AgentType } from "@/lib/api/user/user.types";
import { Tooltip } from "../tooltip";

interface Column {
  id: "name" | "email" | "phoneNumber" | "state" | "gender" | "trafficSource" | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 220 },
  { id: "phoneNumber", label: "Phone number", minWidth: 170 },
  { id: "state", label: "State", minWidth: 170 },
  { id: "gender", label: "Gender", minWidth: 170 },
  { id: "trafficSource", label: "Source", minWidth: 170 },
  { id: "action", label: "", minWidth: 170 },
];

interface Data {
  name: string;
  email: string;
  phoneNumber: string;
  state: string;
  gender: string;
  trafficSource: string;
  action: React.ReactNode;
}

function createTableData(
  name: string,
  email: string,
  phoneNumber: string,
  state: string,
  gender: string,
  trafficSource: string,
  action: React.ReactNode
): Data {
  return { name, email, phoneNumber, state, gender, trafficSource, action };
}

interface Props {
  onRowClick?: (user: IPartner, status: PartnerStatus, agentType?: AgentType) => void;
  data: PaginatedResponse<IPartner> | null;
  page: number;
  limit: number;
  onLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (_: unknown, newPage: number) => void;
}

function PartnersTable({ data, page, limit, onLimitChange, onPageChange, onRowClick }: Props) {
  const rows =
    data?.items?.map((x) =>
      createTableData(
        getUserName(x?.client),
        x?.client?.email,
        x?.client?.phoneNumber || "N/A",
        x?.client?.state?.state || "N/A",
        capitalizeAndSpace(x?.client?.gender || "") || "N/A",
        capitalizeAndSpace(x?.client?.trafficSource || "") || "N/A",

        <Stack direction="row" spacing={1}>
          {x?.status !== "APPROVED" && (
            <Button
              disabled={x?.status === "REJECTED"}
              onClick={() => onRowClick?.(x, "REJECTED")}
              color="error"
              disableElevation={false}
              not_rounded
              padding="5px 12px"
            >
              {x?.status === "REJECTED" ? "Declined" : "Decline"}
            </Button>
          )}

          {x?.status !== "REJECTED" && (
            <Tooltip title="Make this user a company agent">
              <Button
                onClick={() => onRowClick?.(x, "APPROVED", "COMPANY")}
                disabled={x?.status === "APPROVED" && x?.client?.agentType === "COMPANY"}
                disableElevation={false}
                not_rounded
                padding="5px 12px"
                endIcon={<Building weight="fill" size={15} />}
                color="info"
              >
                {x?.status === "APPROVED" && x?.client?.agentType === "COMPANY" ? "Approved" : "Approve"}
              </Button>
            </Tooltip>
          )}

          {x?.status !== "REJECTED" && (
            <Tooltip title="Make this user a private agent">
              <Button
                disabled={x?.status === "APPROVED" && x?.client?.agentType === "PRIVATE"}
                onClick={() => onRowClick?.(x, "APPROVED", "PRIVATE")}
                color="info"
                disableElevation={false}
                not_rounded
                padding="5px 12px"
                endIcon={<User weight="fill" size={15} />}
              >
                {x?.status === "APPROVED" && x?.client?.agentType === "PRIVATE" ? "Approved" : "Approve"}
              </Button>
            </Tooltip>
          )}
        </Stack>
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

export { PartnersTable };
