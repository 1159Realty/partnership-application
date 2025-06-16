"use client";

import { useCallback } from "react";
import { ApiResponse, PaginatedResponse } from "../api.types";
import { getClient, postClient, putClient, removeClient } from "../client.api";
import { formatError } from "@/services/errors";
import { FetchSupportArgs, ISupport, ISupportCategory, SupportCategoryPayload, SupportPayload } from "./types";
import { SupportCategoryFormState } from "@/components/forms/SupportCategoryForm";
import { z } from "zod";
import { formatZodErrors } from "@/services/validation/zod";
import { SupportTicketFormState } from "@/components/forms/SupportForm";

function useSupport() {
  async function createSupportCategory(initialState: SupportCategoryFormState, payload: SupportCategoryPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      name: z.string().nonempty({ message: "This field is required" }),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<ISupportCategory> | null = null;

      try {
        response = await postClient<ISupportCategory>("support-categories", validation.data);

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

  async function createSupportTicket(initialState: SupportTicketFormState, payload: SupportPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      supportCategoryId: z.string({ message: "This field is required" }).nonempty({ message: "This field is required" }),
      message: z.string().nonempty({ message: "This field is required" }),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<ISupport> | null = null;

      let data = {
        ...validation.data,
      };

      if (payload?.supportId) {
        data = {
          message: data?.message,
          supportCategoryId: data?.supportCategoryId,
        };
      }

      try {
        if (payload?.supportId) {
          response = await putClient<ISupport>(`support/${payload.supportId}`, data);
        } else {
          response = await postClient<ISupport>("support", data);
        }
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

  const fetchSupportTickets = useCallback(async (args?: FetchSupportArgs): Promise<PaginatedResponse<ISupport> | null> => {
    try {
      const response = await getClient<PaginatedResponse<ISupport> | null>(
        `support?page=${args?.page || 1}&limit=${args?.limit || 10}${
          args?.supportCategoryId ? `&supportCategoryId=${args.supportCategoryId}` : ""
        }${args?.status ? `&status=${args.status}` : ""}${args?.userId ? `&userId=${args.userId}` : ""}`
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

  const fetchSupportCategories = useCallback(async (): Promise<PaginatedResponse<ISupportCategory> | null> => {
    try {
      const response = await getClient<PaginatedResponse<ISupportCategory> | null>(`support-categories`);

      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const deleteSupportCategory = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await removeClient<boolean>(`support-categories/${id}`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  const resolveSupport = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await getClient<boolean>(`support/mark-resolved/${id}`);
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
    fetchSupportCategories,
    createSupportCategory,
    deleteSupportCategory,
    resolveSupport,
    createSupportTicket,
    fetchSupportTickets,
  };
}

export { useSupport };
