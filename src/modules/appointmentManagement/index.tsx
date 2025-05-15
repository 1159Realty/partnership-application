import { fetchAppointments } from "@/lib/api/appointment/server.appointment";
import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { PageTitle } from "@/components/typography";
import { Box } from "@mui/material";
import { fetchStates } from "@/lib/api/location/server.location";
import { fetchInterests } from "@/lib/api/interest/server";
import { fetchAvailabilities } from "@/lib/api/availability/server.availability";

async function AppointmentManagement() {
  const appointmentDataResponse = fetchAppointments();
  const interestDataResponse = fetchInterests();
  const availabilityDataResponse = fetchAvailabilities();
  const statesDataResponse = fetchStates();

  const [appointmentsData, interestsData, availabilitiesData, statesData] = await Promise.all([
    appointmentDataResponse,
    interestDataResponse,
    availabilityDataResponse,
    statesDataResponse,
  ]);

  return (
    <ModulePageWrapper>
      <PageTitle mr={"5px"}>Appointment Management</PageTitle>
      <Box>
        <Main
          appointmentsData={appointmentsData}
          interestsData={interestsData}
          availabilitiesData={availabilitiesData}
          states={statesData}
        />
      </Box>
    </ModulePageWrapper>
  );
}

export { AppointmentManagement };
