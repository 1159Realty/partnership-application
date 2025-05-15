import { formatError } from "@/services/errors";
import { PaginatedResponse } from "../api.types";
import {
  FetchCampaignArgs,
  FetchCampaignRecipientsArgs,
  FetchCampaignRecipientsGroupsArgs,
  FetchCampaignTemplateArgs,
  FetchDesignArgs,
  FetchFailedCampaignDeliveriesArgs,
  ICampaign,
  ICampaignRecipient,
  ICampaignRecipientsGroup,
  ICampaignTemplate,
  IDesign,
  IFailedCampaignDelivery,
} from "./types";
import { getServer } from "../sever.api";

const fetchCampaigns = async (args?: FetchCampaignArgs): Promise<PaginatedResponse<ICampaign> | null> => {
  try {
    const response = await getServer<PaginatedResponse<ICampaign> | null>(
      `marketing/campaign?page=${args?.page || 1}&limit=${args?.limit || 10}${
        args?.keyword?.trim() ? `&keyword=${args.keyword}` : ""
      }${args?.type ? `&type=${args.type}` : ""}${args?.designId ? `&designId=${args.designId}` : ""}`
    );
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

const fetchFailedCampaignDeliveries = async (
  args?: FetchFailedCampaignDeliveriesArgs
): Promise<PaginatedResponse<IFailedCampaignDelivery> | null> => {
  try {
    const response = await getServer<PaginatedResponse<IFailedCampaignDelivery> | null>(
      `campaigns/failed-deliveries?page=${args?.page || 1}&limit=${args?.limit || 10}${
        args?.keyword?.trim() ? `&keyword=${args.keyword}` : ""
      }`
    );
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

const fetchDesign = async (args?: FetchDesignArgs): Promise<PaginatedResponse<IDesign> | null> => {
  try {
    const response = await getServer<PaginatedResponse<IDesign> | null>(
      `marketing/campaign-design?page=${args?.page || 1}&limit=${args?.limit || 10}${
        args?.keyword?.trim() ? `&keyword=${args.keyword}` : ""
      }`
    );
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

const fetchCampaignTemplate = async (args?: FetchCampaignTemplateArgs): Promise<PaginatedResponse<ICampaignTemplate> | null> => {
  try {
    const response = await getServer<PaginatedResponse<ICampaignTemplate> | null>(
      `marketing/campaign-template?page=${args?.page || 1}&limit=${args?.limit || 10}${
        args?.keyword?.trim() ? `&keyword=${args.keyword}` : ""
      }${args?.type ? `&type=${args.type}` : ""}${args?.designId ? `&designId=${args.designId}` : ""}`
    );
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

// Recipient groups
const fetchCampaignRecipientsGroups = async (
  args?: FetchCampaignRecipientsGroupsArgs
): Promise<PaginatedResponse<ICampaignRecipientsGroup> | null> => {
  try {
    const response = await getServer<PaginatedResponse<ICampaignRecipientsGroup> | null>(
      `marketing/campaign-recipients-group?page=${args?.page || 1}&limit=${args?.limit || 10}${
        args?.keyword?.trim() ? `&keyword=${args.keyword}` : ""
      }`
    );
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

const fetchCampaignRecipientsGroup = async (groupId: string): Promise<ICampaignRecipientsGroup | null> => {
  try {
    const response = await getServer<ICampaignRecipientsGroup | null>(`marketing/campaign-recipients-group/${groupId}`);
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

//Recipients
const fetchCampaignRecipients = async (
  groupId: string,
  args?: FetchCampaignRecipientsArgs
): Promise<PaginatedResponse<ICampaignRecipient> | null> => {
  try {
    const response = await getServer<PaginatedResponse<ICampaignRecipient> | null>(
      `marketing/campaign-recipient?page=${args?.page || 1}&limit=${args?.limit || 10}&groupId=${groupId}${
        args?.keyword?.trim() ? `&keyword=${args.keyword}` : ""
      }`
    );
    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
};

export {
  fetchCampaigns,
  fetchFailedCampaignDeliveries,
  fetchDesign,
  fetchCampaignTemplate,
  fetchCampaignRecipients,
  fetchCampaignRecipientsGroups,
  fetchCampaignRecipientsGroup,
};
