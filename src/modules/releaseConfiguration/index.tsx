import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchReleaseRecipients } from "@/lib/api/release/server";

async function ReleaseConfiguration() {
  const recipientDataResponse = fetchReleaseRecipients();
  const recipientsDataResponse = fetchReleaseRecipients();

  const [recipientData, recipientsData] = await Promise.all([recipientDataResponse, recipientsDataResponse]);

  return (
    <ModulePageWrapper>
      <Main recipientsData={recipientsData} releaseRecipientsData={recipientData} />
    </ModulePageWrapper>
  );
}

export { ReleaseConfiguration };
