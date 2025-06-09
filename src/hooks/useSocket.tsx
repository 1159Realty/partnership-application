// hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (url: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect
    socketRef.current = io(url, { transports: ["websocket"] });

    // Optional: log connection
    socketRef.current.on("connect", () => {});

    // Cleanup on unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  return socketRef.current;
};
