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
  }),
});

export const { useGetMyTradesQuery, useExecuteTokenTradeMutation } = tradeApi;
