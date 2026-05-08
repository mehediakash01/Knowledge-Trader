import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getAccessToken } from "@/services/auth.service";

export const tagTypes = [
  "user",
  "skillPost",
  "trade",
  "review",
  "notification",
] as const;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = getAccessToken();

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes,
  endpoints: () => ({}),
});
