import { baseApi } from "@/redux/api/baseApi";
import type { IApiResponse, IMyTradesResponse } from "@/types";

export const tradeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useGetMyTradesQuery } = tradeApi;
