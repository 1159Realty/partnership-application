import { CampaignRecipientGroupDetail } from "@/modules/campaignRecipientGroupDetail";

interface Props {
  params: Promise<{ recipientsGroupId: string }>;
}

async function CampaignRecipients({ params }: Props) {
  const { recipientsGroupId } = await params;

  return <CampaignRecipientGroupDetail recipientsGroupId={recipientsGroupId} />;
}

export default CampaignRecipients;
