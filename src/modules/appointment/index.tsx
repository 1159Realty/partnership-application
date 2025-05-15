import React from "react";
import { PageTitle } from "@/components/typography";
import { fetchAppointmentsByUserId } from "@/lib/api/appointment/server.appointment";
import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { Box } from "@mui/material";

async function Appointment() {
  const appointmentData = await fetchAppointmentsByUserId();

  return (
    <ModulePageWrapper>
      <PageTitle mr={"5px"}>Appointments</PageTitle>
      <Box mt="16px">
        <Main appointmentsData={appointmentData} />
      </Box>
    </ModulePageWrapper>
  );
}

export { Appointment };
