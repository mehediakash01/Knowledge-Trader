import { baseApi } from "@/redux/api/baseApi";
import type { IApiResponse } from "@/types";

export interface IAdminStats {
  totalUsers: number;
  totalPosts: number;
  totalTrades: number;
  totalTokensInCirculation: number;
}

export interface ITradeAnalytics {
  date: string;
  count: number;
  volume: number;
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<IAdminStats, void>({
      query: () => ({
        url: "/analytics/admin-stats",
        method: "GET",
      }),
      transformResponse: (response: IApiResponse<IAdminStats>) => response.data,
      providesTags: ["user", "trade", "skillPost"],
    }),
    getTradeAnalytics: builder.query<ITradeAnalytics[], void>({
      query: () => ({
        url: "/analytics/trades",
        method: "GET",
      }),
      transformResponse: (response: IApiResponse<ITradeAnalytics[]>) => response.data,
      providesTags: ["trade"],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetTradeAnalyticsQuery,
} = analyticsApi;
