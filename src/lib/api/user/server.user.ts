"use server";

import { formatError } from "@/services/errors";
import { FetchUsersArg, User } from "./user.types";
import { getServerSession, updateServerSessionUser } from "@/lib/session/server";
import { PaginatedResponse, Session } from "../api.types";
import { getServer } from "../sever.api";
import { phoneNumberToReferralId } from "@/services/string";

async function fetchUserData(): Promise<User | null> {
  let session: Session | null = null;
  try {
    session = await getServerSession();
    const userId = session?.user?.id;
    if (!userId) return null;

    const response = await getServer<User>(`users/${userId}`);
    if (response?.result) {
      await updateServerSessionUser(response.result);
      return response.result;
    }
    return null;
  } catch (error) {
    console.error(`Unable to fetch user with id=${session?.user?.id}\n. ${formatError(error)}`);
    return null;
  }
}
async function fetchUsers(args?: FetchUsersArg): Promise<PaginatedResponse<User> | null> {
  try {
    const response = await getServer<PaginatedResponse<User>>(`users?page=${args?.page || 1}&limit=${args?.limit || 10}${
      args?.keyword ? `&keyword=${args.keyword}` : ""
    }${args?.roleId ? `&roleId=${args.roleId}` : ""}
${args?.referralId ? `&referralId=${phoneNumberToReferralId(args.referralId)}` : ""}
${args?.byClientOnly ? `&byClientOnly=${args.byClientOnly}` : ""}
${args?.byModerators ? `&byModerators=${args.byModerators}` : ""}
${args?.sort ? `&sort=${args.sort}` : ""}`);
    if (response?.result) {
      return response.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchModerators(): Promise<PaginatedResponse<User> | null> {
  try {
    const response = await getServer<PaginatedResponse<User>>(`users?byModerators=true`);
    if (response?.result) {
      return response.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchUserById(userId: string): Promise<User | null> {
  try {
    const response = await getServer<User>(`users/${userId}`);
    if (response?.result) {
      return response.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchClients(): Promise<PaginatedResponse<User> | null> {
  try {
    const response = await getServer<PaginatedResponse<User>>(`users?byClientOnly=true`);
    if (response?.result) {
      return response.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchUsersByReferralId(): Promise<PaginatedResponse<User> | null> {
  let session: Session | null = null;

  try {
    session = await getServerSession();
    const response = await getServer<PaginatedResponse<User>>(`users?referralId=${session?.user?.phoneNumber}`);
    if (response?.result) {
      return response.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchUserData, fetchModerators, fetchUsers, fetchUsersByReferralId, fetchClients, fetchUserById };
