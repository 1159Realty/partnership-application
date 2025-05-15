"use client";

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Calendar } from "@phosphor-icons/react/dist/ssr";
import {
  AppointmentStatus,
  appointmentStatusArray,
  FetchAppointmentArgs,
  IAppointment,
} from "@/lib/api/appointment/appointment.types";
import { useAppointment } from "@/lib/api/appointment/useAppointment";
import { PaginatedResponse } from "@/lib/api/api.types";
import { AppointmentTable } from "@/components/tables/AppointmentTable";
import { RoundedSelect } from "@/components/Inputs";
import { capitalizeAndSpace } from "@/services/string";
import { ConfirmationWithInputDialog } from "@/components/dialog/ConfirmationWithInputDialog";

interface Props {
  appointmentsData: PaginatedResponse<IAppointment> | null;
}

function Main({ appointmentsData }: Props) {
  const { fetchAppointmentsByUserId, cancelAppointment } = useAppointment();

  const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>();

  const [appointments, setAppointments] = useState<PaginatedResponse<IAppointment> | null>(appointmentsData);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<AppointmentStatus>();

  const hasItem = appointments?.items?.length;

  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }

  function onRowClick(id: string, status: AppointmentStatus) {
    if (status === "CANCELLED") {
      setCancelAppointmentId(id);
    }
  }

  async function confirmCancel(message: string) {
    if (!cancelAppointmentId) return;

    setAppointments((prev) => {
      if (!prev) return prev;
      const newAppointmentData = { ...prev };
      const index = newAppointmentData?.items?.findIndex((x) => x?.id === cancelAppointmentId);
      if (index > -1) {
        newAppointmentData.items[index].status = "CANCELLED";
      }

      return newAppointmentData;
    });
    setCancelAppointmentId(null);
    await cancelAppointment(cancelAppointmentId, message);
  }

  useEffect(() => {
    async function refetchAppointments() {
      const args: FetchAppointmentArgs = {};

      args.page = page + 1;
      args.status = status;
      const response = await fetchAppointmentsByUserId(args);
      if (response) {
        setAppointments(response);
      }
    }

    refetchAppointments();
  }, [fetchAppointmentsByUserId, page, status]);

  return (
    <Box>
      <Box my="32px" width={"90%"} maxWidth={"200px"}>
        <RoundedSelect
          label="Status filter"
          items={[
            ...appointmentStatusArray.map((x) => ({
              label: capitalizeAndSpace(x),
              id: x,
            })),
            { label: "All", id: "" },
          ]}
          onChange={(e) => {
            setStatus(e.target.value as AppointmentStatus);
          }}
          value={status || ""}
        />
      </Box>
      {!hasItem ? (
        <NoListItemCard
          Icon={Calendar}
          noItemCreatedDescription="No scheduled appointments"
          noItemFoundDescription="No appointments found"
          noItemCreated={Boolean(!appointments?.items?.length && !appointmentsData?.items?.length)}
        />
      ) : (
        <Box>
          <Box>
            <AppointmentTable
              onLimitChange={onLimitChange}
              onRowClick={onRowClick}
              onPageChange={onPageChange}
              page={page}
              limit={limit}
              data={appointments}
            />
          </Box>
          <ConfirmationWithInputDialog
            message="Why do you want to cancel this appointment?"
            isOpen={Boolean(cancelAppointmentId)}
            onClose={() => setCancelAppointmentId(null)}
            onConfirm={confirmCancel}
            declineText="Cancel"
            confirmText="Submit"
          />
        </Box>
      )}
    </Box>
  );
}

export { Main };
