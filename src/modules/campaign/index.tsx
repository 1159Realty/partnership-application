import {
  fetchCampaignRecipientsGroups,
  fetchCampaigns,
  fetchCampaignTemplate,
  fetchDesign,
  fetchFailedCampaignDeliveries,
} from "@/lib/api/campaign/server";
import { Main } from "./Main";
import { ModulePageWrapper } from "@/styles/globals.styles";
import { fetchUsers } from "@/lib/api/user/server.user";

async function Campaign() {
  const campaignsDataResponse = fetchCampaigns();
  const failedCampaignDeliveriesDataResponse = fetchFailedCampaignDeliveries();
  const designsDataResponse = fetchDesign();
  const campaignTemplatesDataResponse = fetchCampaignTemplate();
  const campaignRecipientsGroupsDataResponse = fetchCampaignRecipientsGroups();
  const usersDataResponse = fetchUsers({ byClientOnly: true });

  const [
    campaignsData,
    failedCampaignDeliveriesData,
    designsData,
    usersData,
    campaignRecipientsGroupsData,
    campaignTemplatesData,
  ] = await Promise.all([
    campaignsDataResponse,
    failedCampaignDeliveriesDataResponse,
    designsDataResponse,
    usersDataResponse,
    campaignRecipientsGroupsDataResponse,
    campaignTemplatesDataResponse,
  ]);

  return (
    <ModulePageWrapper>
      <Main
        usersData={usersData}
        recipientsGroupData={campaignRecipientsGroupsData}
        templatesData={campaignTemplatesData}
        designsData={designsData}
        campaignsData={campaignsData}
        failedCampaignDeliveriesData={failedCampaignDeliveriesData}
      />
    </ModulePageWrapper>
  );
}

export { Campaign };
