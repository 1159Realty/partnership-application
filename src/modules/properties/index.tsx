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
  const enrollmentsDataResponse = fetchEnrollments({ userId: session?.user?.id });
  const interestsDataResponse = fetchInterests({ userId: session?.user?.id });

  const [enrollmentData, states, interestsData] = await Promise.all([
    enrollmentsDataResponse,
    statesDataResponse,
    interestsDataResponse,
  ]);

  return (
    <ModulePageWrapper>
      <Stack rowGap={"10px"} mb="32px" flexWrap={"wrap"} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <PageTitle mr={"5px"}>My Properties</PageTitle>
      </Stack>
      <Main enrollmentData={enrollmentData} interestsData={interestsData} states={states} />
    </ModulePageWrapper>
  );
}

export { Properties };
