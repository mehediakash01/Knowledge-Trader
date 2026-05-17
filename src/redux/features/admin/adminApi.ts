import { baseApi } from "@/redux/api/baseApi";
import type { IApiResponse, IUser } from "@/types";

export type AdminListArgs = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type PaginatedResponse<T> = IApiResponse<T[]> & {
  meta?: { page?: number; limit?: number; total?: number };
};

export type AdminOverview = {
  totals: {
    totalActiveUsers: number;
    totalActiveBazaarSkillPosts: number;
    totalCompletedBarterTransactions: number;
    totalCirculatingTokenPoolVolume: number;
  };
  registrationSeries: Array<{ date: string; registrations: number }>;
  topBarteredCategories: Array<{ category: string; barters: number }>;
};

export type AdminUser = IUser & {
  role: "USER" | "ADMIN" | "MANAGER";
  status: "ACTIVE" | "SUSPENDED" | "BANNED";
  tokenBalance?: number;
  createdAt?: string;
};

export type AdminPost = {
  id: string;
  title: string;
  category: string;
  tokenPrice: number;
  moderationStatus: string;
  createdAt: string;
  creator: { id: string; name: string; email: string };
};

export type AdminDispute = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  sender: { id: string; name: string; email: string; tokenBalance: number };
  receiver: { id: string; name: string; email: string; tokenBalance: number };
  skillOffered: { id: string; title: string; tokenPrice: number };
  skillRequested: { id: string; title: string; tokenPrice: number };
};

export type AdminAiInfra = {
  reviewedPosts: number;
  pendingPosts: number;
  averageAiSentiment: number;
  tokenEvents: number;
  trackedTokenVolume: number;
};

const buildListQuery = (args: AdminListArgs) => ({
  page: args.page,
  limit: args.limit,
  search: args.search || undefined,
  sortBy: args.sortBy || undefined,
  sortOrder: args.sortOrder || undefined,
});

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<AdminOverview, void>({
      query: () => ({ url: "/admin/overview", method: "GET" }),
      transformResponse: (response: IApiResponse<AdminOverview>) => response.data,
      providesTags: ["adminOverview"],
    }),
    getAdminUsers: builder.query<PaginatedResponse<AdminUser>, AdminListArgs>({
      query: (args) => ({ url: "/admin/users", method: "GET", params: buildListQuery(args) }),
      providesTags: ["adminUsers"],
    }),
    updateAdminUser: builder.mutation<
      AdminUser,
      { id: string; role?: "USER" | "ADMIN"; status?: "ACTIVE" | "SUSPENDED" | "BANNED" }
    >({
      query: ({ id, ...body }) => ({ url: `/admin/users/${id}`, method: "PATCH", body }),
      transformResponse: (response: IApiResponse<AdminUser>) => response.data,
      invalidatesTags: ["adminUsers", "adminOverview"],
    }),
    getAdminBazaarPosts: builder.query<PaginatedResponse<AdminPost>, AdminListArgs>({
      query: (args) => ({ url: "/admin/bazaar", method: "GET", params: buildListQuery(args) }),
      providesTags: ["adminBazaar"],
    }),
    moderateAdminPost: builder.mutation<AdminPost, { id: string; action: "CLEAR" | "TAKE_DOWN" }>({
      query: ({ id, action }) => ({
        url: `/admin/bazaar/${id}/moderation`,
        method: "PATCH",
        body: { action },
      }),
      transformResponse: (response: IApiResponse<AdminPost>) => response.data,
      invalidatesTags: ["adminBazaar", "adminOverview"],
    }),
    getAdminDisputes: builder.query<PaginatedResponse<AdminDispute>, AdminListArgs>({
      query: (args) => ({ url: "/admin/disputes", method: "GET", params: buildListQuery(args) }),
      providesTags: ["adminDisputes"],
    }),
    resolveAdminDispute: builder.mutation<AdminDispute, { id: string; action: "REFUND" | "RELEASE" }>({
      query: ({ id, action }) => ({
        url: `/admin/disputes/${id}/resolve`,
        method: "PATCH",
        body: { action },
      }),
      transformResponse: (response: IApiResponse<AdminDispute>) => response.data,
      invalidatesTags: ["adminDisputes", "adminOverview", "adminAiInfra"],
    }),
    getAdminAiInfra: builder.query<AdminAiInfra, void>({
      query: () => ({ url: "/admin/ai-infra", method: "GET" }),
      transformResponse: (response: IApiResponse<AdminAiInfra>) => response.data,
      providesTags: ["adminAiInfra"],
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
  useGetAdminBazaarPostsQuery,
  useModerateAdminPostMutation,
  useGetAdminDisputesQuery,
  useResolveAdminDisputeMutation,
  useGetAdminAiInfraQuery,
} = adminApi;
