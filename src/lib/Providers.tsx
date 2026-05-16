"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";

import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { store } from "@/redux/store";
import { Toaster } from "@/components/UI/sonner";
import { SocketProvider } from "@/context/SocketContext";
import {
  getAccessToken,
  getAuthUser,
  getRefreshToken,
} from "@/services/auth.service";
import type { IUser } from "@/types/auth";

interface ProvidersProps {
  children: ReactNode;
}

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <GoogleOAuthProvider clientId={googleClientId || ""}>
          <AuthStateHydrator />
          <SocketProvider>{children}</SocketProvider>
          <Toaster richColors position="top-right" />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

function AuthStateHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setCredentials({
        user: getAuthUser<IUser>(),
        accessToken: getAccessToken(),
        refreshToken: getRefreshToken(),
      })
    );
  }, [dispatch]);

  return null;
}
