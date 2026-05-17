import { baseApi } from "@/redux/api/baseApi";
import type { IApiResponse } from "@/types";

export interface INotification {
  id: string;
  message: string;
  type: "TRADE" | "REVIEW" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
}

export interface INotificationsResponse {
  notifications: INotification[];
  unreadCount: number;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<INotificationsResponse, void>({
      query: () => ({ url: "/notifications/my", method: "GET" }),
      transformResponse: (res: IApiResponse<INotificationsResponse>) => res.data,
      providesTags: ["notification"],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({ url: "/notifications/mark-as-read", method: "PATCH" }),
      invalidatesTags: ["notification"],
    }),
  }),
});

export const { useGetMyNotificationsQuery, useMarkAllAsReadMutation } = notificationApi;
