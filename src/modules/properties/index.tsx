import { Stack } from "@mui/material";
import { PageTitle } from "@/components/typography";
import { fetchStates } from "@/lib/api/location/server.location";
import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchInterests } from "@/lib/api/interest/server";
import { fetchEnrollments } from "@/lib/api/enrollment/server";
import { getServerSession } from "@/lib/session/server";

async function Properties() {
  const session = await getServerSession();

  const statesDataResponse = fetchStates();
  const allEnrollmentsDataResponse = fetchEnrollments({ userId: session?.user?.id });
  const completedEnrollmentsDataResponse = fetchEnrollments({ userId: session?.user?.id, status: "COMPLETED" });
  const interestsDataResponse = fetchInterests({ userId: session?.user?.id });

  const [allEnrollmentData, completedEnrollmentsData, states, interestsData] = await Promise.all([
    allEnrollmentsDataResponse,
    completedEnrollmentsDataResponse,
    statesDataResponse,
    interestsDataResponse,
  ]);

  return (
    <ModulePageWrapper>
      <Stack rowGap={"10px"} mb="32px" flexWrap={"wrap"} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <PageTitle mr={"5px"}>My Properties</PageTitle>
      </Stack>
      <Main
        allEnrollmentData={allEnrollmentData}
        completedEnrollmentsData={completedEnrollmentsData}
        interestsData={interestsData}
        states={states}
      />
    </ModulePageWrapper>
  );
}

export { Properties };
