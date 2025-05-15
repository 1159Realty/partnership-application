import { formatError } from "@/services/errors";
import { PaginatedResponse } from "../api.types";
import { getServer } from "../sever.api";
import { FetchReleaseRecipientArgs, FetchReleasesArgs, IRelease, IReleaseRecipient, ReleaseStatus } from "./types";

async function fetchReleases(args?: FetchReleasesArgs): Promise<PaginatedResponse<IRelease> | null> {
  try {
    const response = await getServer<PaginatedResponse<IRelease> | null>(
      `release-recipients/releases?page=${args?.page || 1}&limit=${args?.limit || 10}${
        args?.userId ? `&userId=${args.userId}` : ""
      }${args?.status ? `&status=${args.status}` : ""}`
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

async function fetchReleaseRecipients(args?: FetchReleaseRecipientArgs): Promise<PaginatedResponse<IReleaseRecipient> | null> {
  try {
    const response = await getServer<PaginatedResponse<IReleaseRecipient> | null>(
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
}

async function fetchReleaseConfigStatus(): Promise<ReleaseStatus | null> {
  try {
    const response = await getServer<ReleaseStatus | null>(`releases/config-status`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchReleases, fetchReleaseRecipients, fetchReleaseConfigStatus };
