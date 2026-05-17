import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { getAccessToken } from "@/services/auth.service";
import { logout } from "@/redux/features/auth/authSlice";

export const tagTypes = [
  "user",
  "User",
  "skillPost",
  "SkillPosts",
  "MySkills",
  "trade",
  "Trades",
  "Barters",
  "review",
  "notification",
  "adminOverview",
  "adminUsers",
  "adminBazaar",
  "adminDisputes",
  "adminAiInfra",
] as const;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: ((): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      credentials: "include",
      prepareHeaders: (headers) => {
        const token = getAccessToken();

        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }

        return headers;
      },
      timeout: 30000,
    });

    const getErrorMessage = (errorData: unknown): string => {
      if (typeof errorData === "string") {
        return errorData;
      }

      if (typeof errorData !== "object" || errorData === null) {
        return "";
      }

      if (!("message" in errorData)) {
        return "";
      }

      return typeof errorData.message === "string" ? errorData.message : "";
    };

    const isSessionExpiredError = (error: FetchBaseQueryError): boolean => {
      if (error.status !== 401) {
        return false;
      }

      const message = getErrorMessage(error.data);

      return (
        message === "Your session has expired" ||
        message === "You are not authorized" ||
        message === "Invalid token payload"
      );
    };

    return async (args, api, extraOptions) => {
      const result = await rawBaseQuery(args, api, extraOptions);

      if ("error" in result && result.error && isSessionExpiredError(result.error)) {
        api.dispatch(logout());

        if (typeof window !== "undefined") {
          const { pathname } = window.location;

          if (pathname !== "/login" && pathname !== "/register") {
            window.location.replace("/login");
          }
        }
      }

      return result;
    };
  })(),
  tagTypes,
  endpoints: () => ({}),
});
