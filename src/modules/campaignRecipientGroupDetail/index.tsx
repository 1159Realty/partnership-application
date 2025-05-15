import { fetchCampaignRecipients, fetchCampaignRecipientsGroup } from "@/lib/api/campaign/server";
import { Main } from "./Main";
import { ModulePageWrapper } from "@/styles/globals.styles";
import { fetchStates } from "@/lib/api/location/server.location";
import { fetchUsers } from "@/lib/api/user/server.user";

interface Props {
  recipientsGroupId: string;
}

async function CampaignRecipientGroupDetail({ recipientsGroupId }: Props) {
  const campaignRecipientsDataResponse = fetchCampaignRecipients(recipientsGroupId);
  const campaignRecipientsGroupDataResponse = fetchCampaignRecipientsGroup(recipientsGroupId);
  const usersDataResponse = fetchUsers({ byClientOnly: true });
  const statesDataResponse = fetchStates();

  const [campaignRecipientsData, campaignRecipientsGroupData, states, usersData] = await Promise.all([
    campaignRecipientsDataResponse,
    campaignRecipientsGroupDataResponse,
    statesDataResponse,
    usersDataResponse,
  ]);

  return (
    <ModulePageWrapper>
      <Main
        usersData={usersData}
        groupId={recipientsGroupId}
        recipientGroup={campaignRecipientsGroupData}
        recipientsData={campaignRecipientsData}
        states={states}
      />
    </ModulePageWrapper>
  );
}

export { CampaignRecipientGroupDetail };
