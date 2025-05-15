import { formatError } from "@/services/errors";
import { PaginatedResponse } from "../api.types";
import { getServer } from "../sever.api";
import { FetchSupportArgs, ISupport, ISupportCategory } from "./types";

async function fetchSupportTickets(args?: FetchSupportArgs): Promise<PaginatedResponse<ISupport> | null> {
  try {
    const response = await getServer<PaginatedResponse<ISupport> | null>(
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
}
async function fetchSupportCategories(): Promise<PaginatedResponse<ISupportCategory> | null> {
  try {
    const response = await getServer<PaginatedResponse<ISupportCategory> | null>(`support-categories`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchSupportTickets, fetchSupportCategories };
