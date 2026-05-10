import { baseApi } from "@/redux/api/baseApi";
import type { IApiResponse, IMyTradesResponse } from "@/types";

export interface IExecuteTokenTradePayload {
  postId: string;
}

export const tradeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    executeTokenTrade: builder.mutation<void, IExecuteTokenTradePayload>({
      query: (payload) => ({
        url: "/trades/token-trade",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["trade", "skillPost", "user"],
    }),
    getMyTrades: builder.query<IMyTradesResponse, void>({
      query: () => ({
        url: "/trades/my-trades",
        method: "GET",
      }),
      transformResponse: (response: IApiResponse<IMyTradesResponse>) =>
        response.data,
      providesTags: [{ type: "trade", id: "MY_TRADES" }],
    }),
    createBarterRequest: builder.mutation<void, any>({
      query: (payload) => ({
        url: "/trades/barter-request",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["trade", "skillPost"],
    }),
    updateBarterStatus: builder.mutation<
      void,
      { barterId: string; status: "ACCEPTED" | "REJECTED" }
    >({
      query: ({ barterId, ...payload }) => ({
        url: `/trades/barter-request/${barterId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["trade", "skillPost", "user"],
    }),
  }),
});

export const {
  useGetMyTradesQuery,
  useExecuteTokenTradeMutation,
  useCreateBarterRequestMutation,
  useUpdateBarterStatusMutation,
} = tradeApi;
