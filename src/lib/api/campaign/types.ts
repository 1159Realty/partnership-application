import { AutoCompleteWithSubOptions } from "@/components/Inputs";
import { Gender, InvitationSource, User } from "../user/user.types";
import { ILga, IState } from "../location/location.types";
import { Dayjs } from "dayjs";

const campaignTypeArr = ["EMAIL", "WHATSAPP", "SMS"] as const;
type CampaignType = (typeof campaignTypeArr)[number];

// campaign
type CampaignPayload = {
  name: string;
  type: CampaignType;
  designId?: string;
  message?: string;
  subject?: string;
  templateId?: string;
  recipientsGroupId?: string;
  brevoListId?: number;
  recipientIds?: string[];
  brevoScheduled?: boolean;
  brevoScheduledAt?: string;
};

type CampaignFormPayload = {
  name: string;
  type: CampaignType;
  templateId?: AutoCompleteWithSubOptions;
  designId?: AutoCompleteWithSubOptions;
  message?: string;
  subject?: string;
  recipientsGroupId?: AutoCompleteWithSubOptions;
  recipientIds?: AutoCompleteWithSubOptions[];
  brevoScheduledAt?: Dayjs | null;
};

interface ICampaign {
  id: string;
  name: string;
  type: CampaignType;
  design: IDesign;
  message: string;
  subject: string;
  recipientCount: number;
  successCount: number;
  pendingCount: number;
  failureCount: number;
  createdAt: string;
  brevoCampaignId: number;
  brevoScheduled: number;
  brevoScheduledAt: number;
  template: ICampaignTemplate;
}

interface FetchCampaignArgs {
  page?: number;
  limit?: number;
  keyword?: string; //design name | campaign name
  type?: CampaignType;
  designId?: string;
}

// failed deliveries
interface IFailedCampaignDelivery {
  id: string;
  campaign: ICampaign;
  recipient: User;
}

interface FetchFailedCampaignDeliveriesArgs {
  page?: number;
  limit?: number;
  keyword?: string; //campaign name
}

// designs
interface IDesign {
  id: string;
  name: string;
}

interface FetchDesignArgs {
  page?: number;
  limit?: number;
  keyword?: string; //design name
}

// campaign template
type CampaignTemplatePayload = {
  name: string;
  type: CampaignType;
  designId?: string;
  message: string;
  subject?: string;
};

type CampaignTemplateFormPayload = {
  name: string;
  type: CampaignType;
  designId?: AutoCompleteWithSubOptions;
  message: string;
  subject?: string;
};

interface ICampaignTemplate {
  id: string;
  name: string;
  type: CampaignType;
  design: IDesign;
  message: string;
  subject: string;
  createdAt: string;
}

interface FetchCampaignTemplateArgs {
  page?: number;
  limit?: number;
  keyword?: string; //template name
  type?: CampaignType;
  designId?: string;
}

// campaign recipients groups
type CampaignRecipientsGroupPayload = {
  name: string;
  stateId?: string;
  gender?: Gender;
  trafficSource?: InvitationSource;
  referralId?: string;
  byClientOnly?: boolean;
};

type CampaignRecipientsGroupFormPayload = {
  name: string;
  stateId?: string;
  areaId?: string;
  gender?: Gender;
  trafficSource?: InvitationSource;
  referralId?: string;
  byClientOnly?: boolean;
};

interface ICampaignRecipientsGroup {
  id: string;
  name: string;
  state: IState;
  lga: ILga;
  gender: Gender;
  trafficSource: InvitationSource;
  referralId: string;
  byClientOnly: boolean;
  countRecipients: number;
  brevoListId: number;
}

interface FetchCampaignRecipientsGroupsArgs {
  page?: number;
  limit?: number;
  keyword?: string; //group  name
}

// campaign recipients
interface ICampaignRecipient {
  recipient: User;
  group: ICampaignRecipientsGroup;
  id: string;
}

interface FetchCampaignRecipientsArgs {
  page?: number;
  limit?: number;
  keyword?: string;
  //user  name
}

export type {
  // campaign
  CampaignPayload,
  CampaignFormPayload,
  ICampaign,
  FetchCampaignArgs,
  // failed deliveries
  IFailedCampaignDelivery,
  FetchFailedCampaignDeliveriesArgs,
  // campaign template
  CampaignTemplatePayload,
  CampaignTemplateFormPayload,
  ICampaignTemplate,
  FetchCampaignTemplateArgs,
  // designs
  IDesign,
  FetchDesignArgs,
  // campaign recipients groups
  ICampaignRecipientsGroup,
  FetchCampaignRecipientsGroupsArgs,
  // campaign recipients
  ICampaignRecipient,
  FetchCampaignRecipientsArgs,
  CampaignType,
  CampaignRecipientsGroupPayload,
  CampaignRecipientsGroupFormPayload,
};
export { campaignTypeArr };
