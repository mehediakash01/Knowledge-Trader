import { baseApi } from "@/redux/api/baseApi";
import type {
  IApiResponse,
  ISkillPost,
  ISkillPostListResponse,
  ISkillPostPaginationMeta,
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

interface IGetSkillPostsPayload {
  meta: ISkillPostPaginationMeta;
  data: ISkillPost[];
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
  }),
});

export const {
  useGetAllSkillPostsQuery,
  useGetCategoriesQuery,
  useGetSkillPostByIdQuery,
} = skillPostApi;
