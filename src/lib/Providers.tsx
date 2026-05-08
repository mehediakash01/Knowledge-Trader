"use client";

import { useEffect, type ReactNode } from "react";
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
      <AuthStateHydrator />
      {children}
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
