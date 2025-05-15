"use client";

import { PaginatedResponse } from "../api.types";
import { getClient, postClient, putClient } from "../client.api";
import { formatError } from "@/services/errors";
import { useCallback } from "react";
import { FetchPartnersArgs, IPartner } from "./types";
import { AgentType } from "../user/user.types";

function usePartners() {
  const fetchPartners = useCallback(async (args?: FetchPartnersArgs): Promise<PaginatedResponse<IPartner> | null> => {
    try {
      const response = await getClient<PaginatedResponse<IPartner> | null>(
        `partnerships?page=${args?.page || 1}&limit=${args?.limit || 10}${args?.keyword ? `&keyword=${args.keyword}` : ""}${
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

  const requestPartnerShip = useCallback(async (): Promise<IPartner | null> => {
    try {
      const response = await postClient<IPartner>(`partnerships`);
      if (response?.statusCode === 201) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const approvePartnership = useCallback(async (id: string, agentType: AgentType): Promise<IPartner | null> => {
    try {
      const response = await putClient<IPartner>(`partnerships/${id}`, {
        status: "APPROVED",
        agentType: agentType,
      });
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const declinePartnership = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await putClient<boolean>(`partnerships/${id}`, {
        status: "REJECTED",
        agentType: "PRIVATE",
      });
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  return { fetchPartners, approvePartnership, declinePartnership, requestPartnerShip };
}

export { usePartners };
