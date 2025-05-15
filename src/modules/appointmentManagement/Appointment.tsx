"use client";

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Calendar } from "@phosphor-icons/react/dist/ssr";
import { ConfirmationDialog } from "@/components/dialog/Confirmation";
import { AppointmentStatus, IAppointment } from "@/lib/api/appointment/appointment.types";
import { useAppointment } from "@/lib/api/appointment/useAppointment";
import { PaginatedResponse } from "@/lib/api/api.types";
import { AppointmentManagementFilters, IAppointmentManagementFilter } from "@/components/filters/AppointmentManagementFilters";
import { IState } from "@/lib/api/location/location.types";
import { useDebounce } from "use-debounce";
import { ConfirmationWithInputDialog } from "@/components/dialog/ConfirmationWithInputDialog";
import { AppointmentManagementTable } from "@/components/tables/AppointmentManagementTable";

interface Props {
  appointmentsData: PaginatedResponse<IAppointment> | null;
  states: IState[] | null;
}

function Appointment({ appointmentsData, states }: Props) {
  const { fetchAppointments, cancelAppointment, completeAppointment } = useAppointment();

  const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>();
  const [completeAppointmentId, setCompleteAppointmentId] = useState<string | null>();

  const [appointments, setAppointments] = useState<PaginatedResponse<IAppointment> | null>(appointmentsData);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<IAppointmentManagementFilter>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearchQuery] = useDebounce(searchQuery, 700);

  const hasItem = Boolean(appointments?.items?.length);

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
    if (status === "COMPLETED") {
      setCompleteAppointmentId(id);
    }
  }

  async function confirmComplete() {
    if (!completeAppointmentId) return;

    setAppointments((prev) => {
      if (!prev) return prev;
      const newAppointmentData = { ...prev };
      const index = newAppointmentData?.items?.findIndex((x) => x?.id === completeAppointmentId);
      if (index > -1) {
        newAppointmentData.items[index].status = "COMPLETED";
      }
      return newAppointmentData;
    });
    setCompleteAppointmentId(null);
    await completeAppointment(completeAppointmentId);
  }

  async function confirmCancel(message: string) {
    if (!cancelAppointmentId) return;

    setAppointments((prev) => {
      if (!prev) return prev;
      const newAppointmentData = { ...prev };
      const index = newAppointmentData?.items?.findIndex((x) => x?.id === cancelAppointmentId);
      if (index > -1) {
        newAppointmentData.items[index].status = "CANCELLED";
        newAppointmentData.items[index].cancelledReason = message;
      }

      return newAppointmentData;
    });
    setCancelAppointmentId(null);
    await cancelAppointment(cancelAppointmentId, message);
  }

  useEffect(() => {
    async function refetchAppointments() {
      const response = await fetchAppointments({
        page: page + 1,
        keyword: debounceSearchQuery,
        ...filters,
      });
      if (response) {
        setAppointments(response);
      }
    }

    refetchAppointments();
  }, [fetchAppointments, page, debounceSearchQuery, filters]);

  return (
    <Box>
      <Box my="32px">
        <AppointmentManagementFilters
          filters={filters}
          states={states}
          setFilters={setFilters}
          setQuery={setSearchQuery}
          query={searchQuery}
        />
      </Box>
      {!hasItem ? (
        <NoListItemCard
          Icon={Calendar}
          noItemCreatedDescription="No scheduled appointment"
          noItemFoundDescription="No appointment found"
          noItemCreated={Boolean(!appointments?.items?.length && !appointmentsData?.items?.length)}
        />
      ) : (
        <Box>
          <Box mt="32px">
            <AppointmentManagementTable
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
          <ConfirmationDialog
            message="Are you sure you want to complete this appointment?"
            isOpen={Boolean(completeAppointmentId)}
            onClose={() => setCompleteAppointmentId(null)}
            onConfirm={confirmComplete}
          />
        </Box>
      )}
    </Box>
  );
}

export { Appointment };
