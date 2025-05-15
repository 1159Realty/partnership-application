import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchModerators } from "@/lib/api/user/server.user";

async function Teams() {
  const users = await fetchModerators();

  return (
    <ModulePageWrapper>
      <Main usersData={users} />
    </ModulePageWrapper>
  );
}

export { Teams };
