import { baseApi } from "@/redux/api/baseApi";
import type { IApiResponse, ISkillPost } from "@/types";

export interface IMatchSkillResponse {
  matches: {
    post: ISkillPost;
    score: number;
    reason: string;
  }[];
}

export interface IGenerateContentPayload {
  prompt: string;
}

export interface IGenerateContentResponse {
  content: string;
}

export interface ISummarizeReviewsResponse {
  pros: string[];
  cons: string[];
  summary: string;
}

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    matchSkills: builder.mutation<IMatchSkillResponse, void>({
      query: () => ({
        url: "/ai/match",
        method: "POST",
      }),
      transformResponse: (response: IApiResponse<IMatchSkillResponse>) => response.data,
    }),
    generateContent: builder.mutation<IGenerateContentResponse, IGenerateContentPayload>({
      query: (payload) => ({
        url: "/ai/generate-content",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: IApiResponse<IGenerateContentResponse>) => response.data,
    }),
    summarizeReviews: builder.mutation<ISummarizeReviewsResponse, string>({
      query: (postId) => ({
        url: `/ai/summarize-reviews/${postId}`,
        method: "POST",
      }),
      transformResponse: (response: IApiResponse<ISummarizeReviewsResponse>) => response.data,
    }),
  }),
});

export const {
  useMatchSkillsMutation,
  useGenerateContentMutation,
  useSummarizeReviewsMutation,
} = aiApi;
