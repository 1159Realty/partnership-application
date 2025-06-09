import { formatError } from "@/services/errors";
import { PaginatedResponse } from "../api.types";
import { getServer } from "../sever.api";
import { FetchNotificationArgs, INotification } from "./types";

async function fetchNotifications(args?: FetchNotificationArgs): Promise<PaginatedResponse<INotification> | null> {
  try {
    const response = await getServer<PaginatedResponse<INotification> | null>(
      `notifications?page=${args?.page || 1}&limit=${args?.limit || 10}`
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

async function fetchUnreadNotificationsCount(): Promise<number | null> {
  try {
    const response = await getServer<number | null>(`notifications/unread-count`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchNotifications, fetchUnreadNotificationsCount };
