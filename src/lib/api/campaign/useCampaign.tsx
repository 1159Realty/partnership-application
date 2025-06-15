"use client";

import { ApiResponse, PaginatedResponse } from "../api.types";
import { getClient, postClient, removeClient } from "../client.api";
import { formatError } from "@/services/errors";
import { useCallback } from "react";
import {
  CampaignPayload,
  CampaignRecipientsGroupPayload,
  CampaignTemplatePayload,
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
import { CampaignRecipientsGroupFormState } from "@/components/forms/CampaignRecipientsGroupForm";
import { z } from "zod";
import { formatZodErrors } from "@/services/validation/zod";
import { CampaignFormState } from "@/components/forms/CampaignForm";
import { CampaignTemplateFormState } from "@/components/forms/CampaignTemplateForm";

function useCampaign() {
  // Campaign
  async function createCampaign(initialState: CampaignFormState, payload: CampaignPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      name: z.string().nonempty({ message: "This field is required" }),
      type: z.string().nonempty({ message: "This field is required" }),
      subject: z.string({ message: "This field is required" }).nonempty({ message: "This field is required" }),
      designId: z.string().optional(),
      message: z.string().optional(),
      templateId: z.string().optional(),
      scheduledAt: z.string().optional(),
      recipientsGroupId: Boolean(payload?.recipientIds?.length)
        ? z.string().optional()
        : z
            .string({ message: "This field is required if no recipients are provided!" })
            .nonempty({ message: "This field is required if recipients are not provided!" }),
      recipientIds: z.array(z.string()).optional(),
    });

    const validation = schema.safeParse(payload);

    const data = {
      ...validation.data,
      recipientIds: payload?.recipientsGroupId ? undefined : payload?.recipientIds,
      brevoListId: payload?.brevoListId || undefined,
      brevoScheduled: payload?.brevoScheduled || undefined,
      brevoScheduledAt: payload?.brevoScheduledAt || undefined,
    };

    if (validation.success) {
      let response: ApiResponse<ICampaign> | null = null;

      try {
        response = await postClient<ICampaign>("marketing/campaign", data);
        if (response?.statusCode === 200 || response?.statusCode === 201) {
          // Show result if request was successful
          if (response?.result) {
            formState = { result: response.result, error: {} };
          } else {
            formState = { result: true, error: {} };
          }
        }
      } catch (error) {
        // Log error to console
        console.error(formatError(error));
        if (response?.message) {
          console.error(response.message);
        }
      }
      if (response?.statusCode !== 200 && response?.statusCode !== 201) {
        // Show error if request was not successful
        formState = { result: null, error: { requestError: "Something went wrong" } };
      }
    } else {
      // Show validation errors if any.
      formState = { result: null, error: formatZodErrors(validation.error) };
    }
    return formState;
  }

  const fetchCampaigns = useCallback(async (args?: FetchCampaignArgs): Promise<PaginatedResponse<ICampaign> | null> => {
    try {
      const response = await getClient<PaginatedResponse<ICampaign> | null>(
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
  }, []);

  // Templates
  async function createCampaignTemplate(initialState: CampaignTemplateFormState, payload: CampaignTemplatePayload) {
    let formState = { ...initialState };

    const schema = z.object({
      name: z.string().nonempty({ message: "This field is required" }),
      type: z.string().nonempty({ message: "This field is required" }),
      message: z.string().nonempty({ message: "This field is required" }),
      // subject:
      //   payload?.type === "EMAIL"
      //     ? z.string({ message: "This field is required" }).nonempty({ message: "This field is required" })
      //     : z.string().optional(),
      // designId:
      //   payload?.type === "EMAIL"
      //     ? z.string({ message: "This field is required" }).nonempty({ message: "This field is required" })
      //     : z.string().optional(),
      designId: z.string().optional(),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<ICampaignTemplate> | null = null;

      try {
        response = await postClient<ICampaignTemplate>("marketing/campaign-template", validation.data);
        if (response?.statusCode === 200 || response?.statusCode === 201) {
          // Show result if request was successful
          if (response?.result) {
            formState = { result: response.result, error: {} };
          } else {
            formState = { result: true, error: {} };
          }
        }
      } catch (error) {
        // Log error to console
        console.error(formatError(error));
        if (response?.message) {
          console.error(response.message);
        }
      }
      if (response?.statusCode !== 200 && response?.statusCode !== 201) {
        // Show error if request was not successful
        formState = { result: null, error: { requestError: "Something went wrong" } };
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }
    return formState;
  }

  const fetchCampaignTemplates = useCallback(
    async (args?: FetchCampaignTemplateArgs): Promise<PaginatedResponse<ICampaignTemplate> | null> => {
      try {
        const response = await getClient<PaginatedResponse<ICampaignTemplate> | null>(
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
    },
    []
  );

  const fetchFailedCampaignDeliveries = useCallback(
    async (args?: FetchFailedCampaignDeliveriesArgs): Promise<PaginatedResponse<IFailedCampaignDelivery> | null> => {
      try {
        const response = await getClient<PaginatedResponse<IFailedCampaignDelivery> | null>(
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
    },
    []
  );

  const fetchDesign = useCallback(async (args?: FetchDesignArgs): Promise<PaginatedResponse<IDesign> | null> => {
    try {
      const response = await getClient<PaginatedResponse<IDesign> | null>(
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
  }, []);

  // recipients
  async function createCampaignRecipientsGroup(
    initialState: CampaignRecipientsGroupFormState,
    payload: CampaignRecipientsGroupPayload
  ) {
    let formState = { ...initialState };

    const schema = z.object({
      name: z.string().nonempty({ message: "This field is required" }),
      stateId: z.string().optional(),
      gender: z.string().optional(),
      trafficSource: z.string().optional(),
      referralId: z.string().optional(),
      byClientOnly: z.boolean().optional(),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<ICampaignRecipientsGroup> | null = null;

      const data = { ...validation.data, byClientOnly: true };

      try {
        response = await postClient<ICampaignRecipientsGroup>("marketing/campaign-recipients-group", data);
        if (response?.statusCode === 200 || response?.statusCode === 201) {
          // Show result if request was successful
          if (response?.result) {
            formState = { result: response.result, error: {} };
          } else {
            formState = { result: true, error: {} };
          }
        }
      } catch (error) {
        // Log error to console
        console.error(formatError(error));
        if (response?.message) {
          console.error(response.message);
        }
      }
      if (response?.statusCode !== 200 && response?.statusCode !== 201) {
        // Show error if request was not successful
        formState = { result: null, error: { requestError: "Something went wrong" } };
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }
    return formState;
  }

  // Recipient group
  const fetchCampaignRecipientsGroups = useCallback(
    async (args?: FetchCampaignRecipientsGroupsArgs): Promise<PaginatedResponse<ICampaignRecipientsGroup> | null> => {
      try {
        const response = await getClient<PaginatedResponse<ICampaignRecipientsGroup> | null>(
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
    },
    []
  );

  // Recipients
  const fetchCampaignRecipients = useCallback(
    async (groupId: string, args?: FetchCampaignRecipientsArgs): Promise<PaginatedResponse<ICampaignRecipient> | null> => {
      try {
        const response = await getClient<PaginatedResponse<ICampaignRecipient> | null>(
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
    },
    []
  );

  const addCampaignRecipients = useCallback(
    async (recipientsGroupId: string, brevoListId: number, recipientIds: string[]): Promise<boolean> => {
      try {
        const response = await postClient<boolean>(`marketing/campaign-recipient`, {
          recipientsGroupId,
          brevoListId,
          recipientIds,
        });
        if (response?.statusCode === 201) {
          return true;
        }
        return false;
      } catch (error) {
        console.error(formatError(error));
        return false;
      }
    },
    []
  );

  const removeCampaignRecipients = useCallback(async (recipientId: string): Promise<boolean> => {
    try {
      const response = await removeClient<boolean>(`marketing/campaign-recipients/${recipientId}`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  return {
    fetchCampaigns,
    fetchCampaignRecipientsGroups,
    fetchCampaignRecipients,
    fetchFailedCampaignDeliveries,
    fetchDesign,
    createCampaignTemplate,
    fetchCampaignTemplates,
    createCampaignRecipientsGroup,
    createCampaign,
    addCampaignRecipients,
    removeCampaignRecipients,
  };
}

export { useCampaign };
