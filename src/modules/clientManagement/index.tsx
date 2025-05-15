import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { PageTitle } from "@/components/typography";
import { fetchClients } from "@/lib/api/user/server.user";

async function ClientManagement() {
  const usersData = await fetchClients();

  return (
    <ModulePageWrapper>
      <PageTitle mr={"5px"}>Client Management</PageTitle>
      <Main usersData={usersData} />
    </ModulePageWrapper>
  );
}

export { ClientManagement };
