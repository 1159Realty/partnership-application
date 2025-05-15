"use client";
import { PaginatedResponse } from "../api.types";
import { formatError } from "@/services/errors";
import { useCallback } from "react";
import { getClient, postClient, putClient, removeClient } from "../client.api";
import { FetchInterestsArgs, IInterest } from "./types";

function useInterest() {
  async function createInterest(propertyId: string) {
    try {
      const response = await postClient(`interests/`, { propertyId });
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }

  const fetchInterests = useCallback(async (args?: FetchInterestsArgs): Promise<PaginatedResponse<IInterest> | null> => {
    try {
      const response = await getClient<PaginatedResponse<IInterest> | null>(
        `interests?page=${args?.page || 1}&limit=${args?.limit || 10}${args?.propertyId ? `&propertyId=${args.propertyId}` : ""}
${args?.userId ? `&userId=${args.userId}` : ""}
${args?.stateId ? `&stateId=${args.stateId}` : ""}
${args?.lgaId ? `&lgaId=${args.lgaId}` : ""}
${args?.areaId ? `&areaId=${args.areaId}` : ""}`
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

  async function deleteInterest(interestId: string) {
    try {
      const response = await removeClient(`interests/${interestId}`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }

  async function markInterestAsContacted(interestId: string) {
    try {
      const response = await putClient(`interests/${interestId}`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }

  return {
    createInterest,
    fetchInterests,
    deleteInterest,
    markInterestAsContacted,
  };
}

export { useInterest };
