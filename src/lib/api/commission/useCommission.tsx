"use client";

import { PaginatedResponse } from "../api.types";
import { getClient } from "../client.api";
import { formatError } from "@/services/errors";
import { useCallback } from "react";
import { FetchCommissionsArgs, ICommission, ICommissionTotal } from "./types";

function useCommission() {
  const fetchCommissions = useCallback(async (args?: FetchCommissionsArgs): Promise<PaginatedResponse<ICommission> | null> => {
    try {
      const response = await getClient<PaginatedResponse<ICommission> | null>(
        `commissions?page=${args?.page || 1}&limit=${args?.limit || 10}${
          args?.enrollmentId ? `&enrolmentId=${args.enrollmentId}` : ""
        }${args?.agentId ? `&agentId=${args.agentId}` : ""}
${args?.status ? `&status=${args.status}` : ""}`
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

  const fetchCommissionTotal = useCallback(async (): Promise<ICommissionTotal | null> => {
    try {
      const response = await getClient<ICommissionTotal | null>(`commissions/totals`);
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  return { fetchCommissions, fetchCommissionTotal };
}

export { useCommission };
