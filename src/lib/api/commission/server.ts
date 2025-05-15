import { formatError } from "@/services/errors";
import { PaginatedResponse } from "../api.types";
import { getServer } from "../sever.api";
import { FetchCommissionsArgs, ICommission, ICommissionTotal } from "./types";

async function fetchCommissions(args?: FetchCommissionsArgs): Promise<PaginatedResponse<ICommission> | null> {
  try {
    const response = await getServer<PaginatedResponse<ICommission> | null>(`commissions?page=${args?.page || 1}&limit=${
      args?.limit || 10
    }${args?.enrollmentId ? `&enrolmentId=${args.enrollmentId}` : ""}${args?.agentId ? `&agentId=${args.agentId}` : ""}
${args?.status ? `&status=${args.status}` : ""}`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchCommissionTotal(): Promise<ICommissionTotal | null> {
  try {
    const response = await getServer<ICommissionTotal | null>(`commissions/totals`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchCommissions, fetchCommissionTotal };
