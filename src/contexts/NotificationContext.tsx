"use client";

import { INotification } from "@/lib/api/notifications/types";
import { useNotifications } from "@/lib/api/notifications/useNotifications";
import { getClientSession } from "@/lib/session/client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

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
  // const socket = useSocket();

  const session = getClientSession();

  const socket = io("https://dev-api.1159realty.com", {
    // Recommended options for Cloudflare Workers
    transports: ["websocket"],
    upgrade: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    auth: {
      token: session?.token?.access || "",
    },
  });

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

    // Connection established
    socket.on("connect", () => {});

    // Receive messages from server
    socket.on("message", () => {});

    // Receive messages from server
    socket.on("notification", () => {});

    // Custom events can be added similarly
    // socket.on('custom-event', (data) => { ... });

    // Connection error
    socket.on("connect_error", (err) => {
      console.error("Connection Error", "disconnected");
      console.error("Connection error: " + err);
    });

    // Disconnected
    socket.on("disconnect", (reason) => {
      console.error("Disconnected", "disconnected");
      console.error("Disconnected: " + reason);
    });

    socket.on("notification", (data: INotification) => {
      if (!data) return;
      fetchUnreadNotificationsCount().then((count) => {
        setUnreadCount((prev) => count || prev);
      });

      setNewNotification(data);
    });

    return () => {
      socket.off("new-notification");
    };
  }, [fetchUnreadNotificationsCount, socket]);

  const value = {
    unreadCount,
    setUnreadCount,
    newNotification,
    setNewNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
