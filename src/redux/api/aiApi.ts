import { baseApi } from "@/redux/api/baseApi";
import type { IApiResponse, ISkillPost } from "@/types";

export interface IMatchSkillResponse {
  isTrendingFallback?: boolean;
  matches: {
    post: ISkillPost;
    score: number;
    reason: string;
    isPriorityMatch?: boolean;
    hasReciprocalMatch?: boolean;
    matchSkill?: string | null;
  }[];
}

export interface IGenerateContentPayload {
  prompt: string;
}

export interface IGenerateContentResponse {
  longDescription: string;
  specifications: string[];
  difficulty: string;
  estimatedDuration: string;
  content: string;
}

export interface ISummarizeReviewsResponse {
  pros: string[];
  cons: string[];
  summary: string;
}

export interface ISkillAIReview {
  sentimentScore: number;
  pros: string[];
  cons: string[];
  summary: string;
}

export interface ISkillAIReviewResponse {
  review: ISkillAIReview | null;
  warning?: string;
  cachedAt?: string | null;
  generatedAt?: string | null;
  hasCachedReview: boolean;
}

export interface ITradeValuePayload {
  offeredSkillId: string;
  requestedSkillId: string;
}

export interface ITradeValueResponse {
  verdict: "GREAT_DEAL" | "FAIR_TRADE" | "UPGRADE_NEEDED";
  label: string;
  reasoning: string;
  offeredScore: number;
  requestedScore: number;
}

export interface IAnalyticsGrowthArea {
  category: string;
  growth: number;
  insight: string;
}

export interface IKnowledgeAnalyticsResponse {
  headline: string;
  growthAreas: IAnalyticsGrowthArea[];
  topRecommendation: string;
  totalSkillsLearned: number;
  totalTokensInvested: number;
}

export interface ISyllabusModule {
  moduleNumber: number;
  title: string;
  description: string;
  topics: string[];
  estimatedTime: string;
}

export interface ISyllabusResponse {
  syllabus: ISyllabusModule[];
  outcomes: string[];
  targetAudience: string;
  valueProp: string;
}

export interface IGenerateSyllabusPayload {
  title: string;
  roadmapType: "DAILY" | "HOURLY" | "SEVEN_DAY" | "THIRTY_DAY";
  category?: string;
  shortDescription?: string;
}

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAIMatches: builder.query<IMatchSkillResponse, number | void>({
      query: () => ({
        url: "/ai/match",
        method: "POST",
      }),
      transformResponse: (response: IApiResponse<IMatchSkillResponse>) => response.data,
    }),
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
    getSkillAIReview: builder.query<ISkillAIReviewResponse, string>({
      query: (postId) => ({
        url: `/ai/reviews/${postId}`,
        method: "GET",
      }),
      transformResponse: (response: IApiResponse<ISkillAIReviewResponse>) => response.data,
      providesTags: (_result, _error, postId) => [{ type: "skillPost", id: `ai-review-${postId}` }],
    }),
    generateSkillAIReview: builder.mutation<ISkillAIReviewResponse, string>({
      query: (postId) => ({
        url: `/ai/reviews/${postId}/generate`,
        method: "POST",
      }),
      transformResponse: (response: IApiResponse<ISkillAIReviewResponse>) => response.data,
      invalidatesTags: (_result, _error, postId) => [{ type: "skillPost", id: `ai-review-${postId}` }],
    }),
    assessTradeValue: builder.mutation<ITradeValueResponse, ITradeValuePayload>({
      query: (payload) => ({
        url: "/ai/trade-value",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: IApiResponse<ITradeValueResponse>) => response.data,
    }),
    getKnowledgeAnalytics: builder.query<IKnowledgeAnalyticsResponse, void>({
      query: () => ({
        url: "/ai/analytics",
        method: "GET",
      }),
      transformResponse: (response: IApiResponse<IKnowledgeAnalyticsResponse>) => response.data,
      providesTags: [{ type: "user", id: "ANALYTICS" }],
    }),
    generateSyllabus: builder.mutation<ISyllabusResponse, IGenerateSyllabusPayload>({
      query: (payload) => ({
        url: "/ai/generate-syllabus",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: IApiResponse<ISyllabusResponse>) => response.data,
    }),
  }),
});

export const {
  useGetAIMatchesQuery,
  useMatchSkillsMutation,
  useGenerateContentMutation,
  useSummarizeReviewsMutation,
  useGetSkillAIReviewQuery,
  useGenerateSkillAIReviewMutation,
  useAssessTradeValueMutation,
  useGetKnowledgeAnalyticsQuery,
  useGenerateSyllabusMutation,
} = aiApi;
