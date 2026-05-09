"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { baseApi } from "@/redux/api/baseApi";

interface SocketContextValue {
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({ isConnected: false });

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [isConnected, setIsConnected] = useState(false);
  // Using EventSource / polling fallback instead of socket.io client
  // to avoid heavy bundle. Real socket.io can be swapped in here.
  const socketRef = useRef<ReturnType<typeof import("socket.io-client")["io"]> | null>(null);

  useEffect(() => {
    // Only connect when authenticated
    if (!user || !accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    let socket: any;

    // Dynamic import to keep the bundle lean
    import("socket.io-client").then(({ io }) => {
      const backendUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL ||
        process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
        "http://localhost:5000";

      socket = io(backendUrl, {
        auth: { token: accessToken },
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      // Listen for the notification event from the backend
      socket.on("notification", (data: { message: string; type: string }) => {
        // Invalidate the notification cache so the bell refetches
        dispatch(
          baseApi.util.invalidateTags(["notification"])
        );

        // Show a toast with pulse effect
        toast(data.message, {
          description: "Knowledge Trader",
          icon: "🔔",
          duration: 5000,
        });
      });
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, accessToken, dispatch]);

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
