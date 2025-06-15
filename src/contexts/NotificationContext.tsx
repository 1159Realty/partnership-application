"use client";

import { useSocket } from "@/hooks/useSocket";
import { INotification } from "@/lib/api/notifications/types";
import { useNotifications } from "@/lib/api/notifications/useNotifications";
import { createContext, useContext, useEffect, useState } from "react";

export interface Props {
  children?: React.ReactNode;
}

export interface INotificationContext {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  newNotification: INotification | null;
  setNewNotification: React.Dispatch<React.SetStateAction<INotification | null>>;
}

export const NotificationContext = createContext<INotificationContext>({} as INotificationContext);

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};

export const NotificationContextProvider = ({ children }: Props) => {
  const { fetchUnreadNotificationsCount } = useNotifications();
  const socket = useSocket("https://dev-api.1159realty.com");

  const [unreadCount, setUnreadCount] = useState(0);
  const [newNotification, setNewNotification] = useState<INotification | null>(null);

  useEffect(() => {
    async function getUnreadCount() {
      const count = await fetchUnreadNotificationsCount();
      if (count) {
        setUnreadCount(count);
      }
    }
    getUnreadCount();
  }, [fetchUnreadNotificationsCount]);

  useEffect(() => {
    if (newNotification) {
      const timeout = setTimeout(() => {
        setNewNotification(null);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [newNotification]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new-notification", (data: INotification) => {
      if (!data) return;
      setNewNotification(data);
      setUnreadCount((prev) => data?.unReadCount || prev + 1);
    });

    return () => {
      socket.off("new-notification");
    };
  }, [socket]);

  const value = {
    unreadCount,
    setUnreadCount,
    newNotification,
    setNewNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
