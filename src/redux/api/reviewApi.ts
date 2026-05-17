import { baseApi } from "@/redux/api/baseApi";
import type { IApiResponse } from "@/types";

export interface ICreateReviewPayload {
  postId: string;
  rating: number;
  comment: string;
}

export interface IReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    name?: string;
    image?: string;
  };
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<IReview, ICreateReviewPayload>({
      query: (payload) => ({
        url: "/reviews",
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: IApiResponse<IReview>) => res.data,
      invalidatesTags: ["review", "skillPost"],
    }),
  }),
});

export const { useCreateReviewMutation } = reviewApi;
