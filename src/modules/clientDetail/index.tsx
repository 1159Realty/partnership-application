import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchEnrollments } from "@/lib/api/enrollment/server";
import { fetchStates } from "@/lib/api/location/server.location";
import { fetchUserById } from "@/lib/api/user/server.user";
import { getRole } from "@/lib/session/roles";
import { getServerSession } from "@/lib/session/server";

interface Props {
  clientId: string;
}

async function ClientDetail({ clientId }: Props) {
  const session = await getServerSession();

  const enrollmentsDataResponse =
    getRole(session?.user?.roleId) === "agent"
      ? fetchEnrollments({ userId: clientId, agentId: session?.user?.id })
      : fetchEnrollments({ userId: clientId });
  const statesDataResponse = fetchStates();
  const clientDataResponse = fetchUserById(clientId);

  const [statesData, enrollmentsData, clientData] = await Promise.all([
    statesDataResponse,
    enrollmentsDataResponse,
    clientDataResponse,
  ]);

  return (
    <ModulePageWrapper>
      <Main states={statesData} enrollmentsData={enrollmentsData} clientId={clientId} clientData={clientData} />
    </ModulePageWrapper>
  );
}

export { ClientDetail };
