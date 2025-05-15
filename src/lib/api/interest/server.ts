import { formatError } from "@/services/errors";
import { PaginatedResponse } from "../api.types";
import { getServer } from "../sever.api";
import { FetchInterestsArgs, IInterest } from "./types";

async function fetchInterests(args?: FetchInterestsArgs): Promise<PaginatedResponse<IInterest> | null> {
  try {
    const response = await getServer<PaginatedResponse<IInterest> | null>(`interests?page=${args?.page || 1}&limit=${
      args?.limit || 10
    }${args?.propertyId ? `&propertyId=${args.propertyId}` : ""}
${args?.userId ? `&userId=${args.userId}` : ""}
${args?.stateId ? `&stateId=${args.stateId}` : ""}
${args?.lgaId ? `&lgaId=${args.lgaId}` : ""}
${args?.areaId ? `&areaId=${args.areaId}` : ""}`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchInterests };
