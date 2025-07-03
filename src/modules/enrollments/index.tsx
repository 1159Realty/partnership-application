import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchEnrollment, fetchEnrollments } from "@/lib/api/enrollment/server";
import { fetchStates } from "@/lib/api/location/server.location";
import { getRole } from "@/lib/session/roles";
import { getServerSession } from "@/lib/session/server";
import { fetchUsers } from "@/lib/api/user/server.user";

interface Props {
  enrollmentId?: string;
}

async function Enrollments({ enrollmentId }: Props) {
  const session = await getServerSession();
  const role = getRole(session?.user?.roleId);

  const enrollmentsDataResponse = role === "agent" ? fetchEnrollments({ agentId: session?.user?.id }) : fetchEnrollments();
  const enrollmentDataResponse = enrollmentId ? fetchEnrollment(enrollmentId) : undefined;

  const statesDataResponse = fetchStates();
  const usersDataResponse =
    role === "agent"
      ? fetchUsers({
          referralId: session?.user?.myReferralId,
        })
      : fetchUsers({
          byClientOnly: true,
        });

  const [statesData, enrollmentsData, usersData, enrollmentData] = await Promise.all([
    statesDataResponse,
    enrollmentsDataResponse,
    usersDataResponse,
    enrollmentDataResponse,
  ]);

  return (
    <ModulePageWrapper>
      <Main enrollmentData={enrollmentData} states={statesData} usersData={usersData} enrollmentsData={enrollmentsData} />
    </ModulePageWrapper>
  );
}

export { Enrollments };
