"use client";

import { PaginatedResponse } from "../api.types";
import { getClient, postClient, putClient } from "../client.api";
import { formatError } from "@/services/errors";
import { useCallback } from "react";
import { FetchNotificationArgs, INotification } from "./types";

function useNotifications() {
  const fetchNotifications = useCallback(
    async (args?: FetchNotificationArgs): Promise<PaginatedResponse<INotification> | null> => {
      try {
        const response = await getClient<PaginatedResponse<INotification> | null>(
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
    },
    []
  );

  const fetchUnreadNotificationsCount = useCallback(async (): Promise<number | null> => {
    try {
      const response = await postClient<number | null>(`partnerships`);
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const markNotificationsAsRead = useCallback(async (ids: string[]): Promise<boolean> => {
    try {
      const response = await putClient<INotification>(`partnerships`, {
        ids,
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

  const markAllNotificationsAsRead = useCallback(async (): Promise<boolean> => {
    try {
      const response = await putClient<INotification>(`partnerships`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  return { fetchNotifications, fetchUnreadNotificationsCount, markNotificationsAsRead, markAllNotificationsAsRead };
}

export { useNotifications };
