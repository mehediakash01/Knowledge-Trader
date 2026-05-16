import { baseApi } from "@/redux/api/baseApi";
import type {
  IApiResponse,
  IQuestion,
  ISkillPost,
  ISkillPostListResponse,
  ISkillPostPaginationMeta,
  RoadmapType,
} from "@/types";

export interface IGetSkillPostsParams {
  searchTerm?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  page?: number | string;
  limit?: number | string;
  creatorId?: string;
}

export interface ICreateSkillPostPayload {
  title: string;
  slug: string;
  category: string;
  tags?: string[];
  shortDescription: string;
  thumbnail?: string;
  teaserAsset?: string;
  roadmapType?: RoadmapType;
  outcomes?: string[];
  targetAudience?: string;
  prerequisites?: string;
  valueProp?: string;
  longDescription?: string;
  syllabus?: unknown;
  resourceLinks?: string[];
  lockedContent?: unknown;
  tokenPrice: number;
  images?: string[];
}

interface IGetSkillPostsPayload {
  meta: ISkillPostPaginationMeta;
  data: ISkillPost[];
}

interface IQuestionListResponse {
  meta: { page: number; limit: number; total: number };
  data: IQuestion[];
}

export const skillPostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSkillPosts: builder.query<
      ISkillPostListResponse,
      IGetSkillPostsParams | void
    >({
      query: (params) => ({
        url: "/skill-posts",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (response: IApiResponse<ISkillPost[]>) => ({
        meta: response.meta as ISkillPostPaginationMeta,
        data: response.data,
      }),
      providesTags: (result) => {
        const posts = result?.data ?? [];
        return [
          { type: "skillPost" as const, id: "LIST" },
          ...posts.map((post) => ({ type: "skillPost" as const, id: post.id })),
        ];
      },
    }),

    getCategories: builder.query<string[], void>({
      query: () => ({
        url: "/skill-posts/categories",
        method: "GET",
      }),
      transformResponse: (response: IApiResponse<string[]>) => response.data,
      providesTags: [{ type: "skillPost", id: "CATEGORIES" }],
    }),

    getSkillPostById: builder.query<ISkillPost, string>({
      query: (id) => ({
        url: `/skill-posts/${id}`,
        method: "GET",
      }),
      transformResponse: (response: IApiResponse<ISkillPost>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "skillPost", id }],
    }),

    createSkillPost: builder.mutation<ISkillPost, ICreateSkillPostPayload>({
      query: (payload) => ({
        url: "/skill-posts",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: IApiResponse<ISkillPost>) => response.data,
      invalidatesTags: [{ type: "skillPost", id: "LIST" }],
    }),

    updateSkillPost: builder.mutation<
      ISkillPost,
      { id: string; payload: Partial<ICreateSkillPostPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/skill-posts/${id}`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (response: IApiResponse<ISkillPost>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "skillPost", id },
        { type: "skillPost", id: "LIST" },
      ],
    }),

    // Q&A
    getQuestionsForPost: builder.query<
      IQuestionListResponse,
      { postId: string; page?: number; limit?: number }
    >({
      query: ({ postId, page = 1, limit = 10 }) => ({
        url: `/skill-posts/${postId}/questions`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: IApiResponse<IQuestion[]> & { meta: IQuestionListResponse["meta"] }) => ({
        meta: response.meta,
        data: response.data,
      }),
      providesTags: (_result, _error, { postId }) => [
        { type: "skillPost", id: `questions-${postId}` },
      ],
    }),

    askQuestion: builder.mutation<IQuestion, { postId: string; body: string }>({
      query: ({ postId, body }) => ({
        url: `/skill-posts/${postId}/questions`,
        method: "POST",
        body: { body },
      }),
      transformResponse: (response: IApiResponse<IQuestion>) => response.data,
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "skillPost", id: `questions-${postId}` },
      ],
    }),

    answerQuestion: builder.mutation<
      IQuestion,
      { questionId: string; answer: string; postId: string }
    >({
      query: ({ questionId, answer }) => ({
        url: `/skill-posts/questions/${questionId}/answer`,
        method: "PATCH",
        body: { answer },
      }),
      transformResponse: (response: IApiResponse<IQuestion>) => response.data,
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "skillPost", id: `questions-${postId}` },
      ],
    }),
  }),
});

export const {
  useGetAllSkillPostsQuery,
  useGetCategoriesQuery,
  useGetSkillPostByIdQuery,
  useCreateSkillPostMutation,
  useUpdateSkillPostMutation,
  useGetQuestionsForPostQuery,
  useAskQuestionMutation,
  useAnswerQuestionMutation,
} = skillPostApi;
