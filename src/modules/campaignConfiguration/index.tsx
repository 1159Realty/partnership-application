import { fetchCampaignRecipientsGroups, fetchCampaignTemplate, fetchDesign } from "@/lib/api/campaign/server";
import { Main } from "./Main";
import { ModulePageWrapper } from "@/styles/globals.styles";
import { fetchStates } from "@/lib/api/location/server.location";

async function CampaignConfiguration() {
  const campaignTemplatesDataResponse = fetchCampaignTemplate();
  const campaignRecipientsGroupsDataResponse = fetchCampaignRecipientsGroups({ limit: 6 });
  const designsDataResponse = fetchDesign();
  const statesDataResponse = fetchStates();

  const [campaignTemplatesData, campaignRecipientsGroupsData, designsData, states] = await Promise.all([
    campaignTemplatesDataResponse,
    campaignRecipientsGroupsDataResponse,
    designsDataResponse,
    statesDataResponse,
  ]);

  return (
    <ModulePageWrapper>
      <Main
        campaignTemplatesData={campaignTemplatesData}
        campaignRecipientsGroupsData={campaignRecipientsGroupsData}
        designsData={designsData}
        states={states}
      />
    </ModulePageWrapper>
  );
}

export { CampaignConfiguration };
