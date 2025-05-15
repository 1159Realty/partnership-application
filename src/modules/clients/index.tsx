import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { PageTitle } from "@/components/typography";
import { fetchUsers } from "@/lib/api/user/server.user";
import { getServerSession } from "@/lib/session/server";
import { getRole } from "@/lib/session/roles";
import { ROUTES } from "@/utils/constants";

async function Clients() {
  const session = await getServerSession();
  const role = getRole(session?.user?.roleId);
  const usersData =
    role === "agent"
      ? await fetchUsers({
          referralId: session?.user?.phoneNumber,
        })
      : await fetchUsers({
          byClientOnly: true,
        });

  return (
    <ModulePageWrapper>
      <PageTitle backUrl={ROUTES["/enrollments"]} mr={"5px"}>
        Clients
      </PageTitle>
      <Main usersData={usersData} />
    </ModulePageWrapper>
  );
}

export { Clients };
