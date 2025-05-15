import { formatError } from "@/services/errors";
import { PaginatedResponse } from "../api.types";
import { getServer } from "../sever.api";
import { FetchPartnersArgs, IPartner } from "./types";

async function fetchPartners(args?: FetchPartnersArgs): Promise<PaginatedResponse<IPartner> | null> {
  try {
    const response = await getServer<PaginatedResponse<IPartner> | null>(
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
}

export { fetchPartners };
