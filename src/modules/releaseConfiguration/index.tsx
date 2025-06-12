import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchReleaseRecipients } from "@/lib/api/release/server";
import { fetchUsers } from "@/lib/api/user/server.user";

async function ReleaseConfiguration() {
  const recipientDataResponse = fetchReleaseRecipients();
  const usersDataResponse = fetchUsers({ roleId: "agent" });

  const [recipientData, usersData] = await Promise.all([recipientDataResponse, usersDataResponse]);

  return (
    <ModulePageWrapper>
      <Main usersData={usersData} releaseRecipientsData={recipientData} />
    </ModulePageWrapper>
  );
}

export { ReleaseConfiguration };
