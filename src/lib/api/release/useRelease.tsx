"use client";

import { useCallback } from "react";
import { PaginatedResponse } from "../api.types";
import { getClient, postClient, putClient } from "../client.api";
import { formatError } from "@/services/errors";
import { FetchReleaseRecipientArgs, FetchReleasesArgs, IRelease, IReleaseRecipient } from "./types";

function useRelease() {
  const fetchReleases = useCallback(async (args?: FetchReleasesArgs): Promise<PaginatedResponse<IRelease> | null> => {
    try {
      const response = await getClient<PaginatedResponse<IRelease> | null>(
        `release-recipients/releases?page=${args?.page || 1}&limit=${args?.limit || 10}${
          args?.userId ? `&userId=${args.userId}` : ""
        }${args?.enrolmentId ? `&enrolmentId=${args.enrolmentId}` : ""}${args?.type ? `&type=${args.type}` : ""}${
          args?.status ? `&status=${args.status}` : ""
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

  const fetchReleaseRecipients = useCallback(
    async (args?: FetchReleaseRecipientArgs): Promise<PaginatedResponse<IReleaseRecipient> | null> => {
      try {
        const response = await getClient<PaginatedResponse<IReleaseRecipient> | null>(
          `release-recipients/recipients?page=${args?.page || 1}&limit=${args?.limit || 10}${
            args?.keyword ? `&keyword=${args.keyword}` : ""
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

  const approveRelease = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await putClient<boolean>(`payments/approve-manual-release/${id}`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  const approveReleaseNoPay = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await putClient<boolean>(`release-recipients/mark-release-as-paid/${id}`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  const removeRecipients = useCallback(async (recipientIds: string[]): Promise<boolean> => {
    try {
      const response = await putClient<boolean>(`release-recipients/disable-release`, { recipients: recipientIds });
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  const removeAllRecipients = useCallback(async (): Promise<boolean> => {
    try {
      const response = await putClient<boolean>(`release-recipients/disable-all-release`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  const addRecipients = useCallback(async (recipientIds: string[]): Promise<boolean> => {
    try {
      const response = await putClient<boolean>(`release-recipients/enable-release`, { recipients: recipientIds });
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  const addMockRecipients = useCallback(async (recipients: string[]): Promise<boolean> => {
    try {
      const response = await postClient<boolean>(`release-recipients/recipients`, { recipients });
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  const addAllRecipients = useCallback(async (): Promise<boolean> => {
    try {
      const response = await putClient<boolean>(`release-recipients/enable-all-release`);
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
    fetchReleases,
    fetchReleaseRecipients,
    approveRelease,
    removeRecipients,
    removeAllRecipients,
    addRecipients,
    addAllRecipients,
    addMockRecipients,
    approveReleaseNoPay,
  };
}

export { useRelease };
