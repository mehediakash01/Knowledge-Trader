"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";

import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { store } from "@/redux/store";
import { getAccessToken, getRefreshToken } from "@/services/auth.service";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthStateHydrator />
        {children}
      </ThemeProvider>
    </Provider>
  );
}

function AuthStateHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setCredentials({
        accessToken: getAccessToken(),
        refreshToken: getRefreshToken(),
      })
    );
  }, [dispatch]);

  return null;
}
