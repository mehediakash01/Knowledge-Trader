import { baseApi } from "@/redux/api/baseApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import type { IUser } from "@/types/auth";
import type { IApiResponse, ISkillPost } from "@/types";

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  reputationScore: number;
  image?: string | null;
  bio?: string | null;
  tagline?: string | null;
  socialLinks?: Array<{ platform: string; url: string }>;
  experience?: Array<{ title: string; company: string; duration: string }>;
  expertise?: Array<{ name: string; level: "Beginner" | "Intermediate" | "Expert" }>;
  learningPath?: Array<{ name: string; priority: number }>;
  posts: ISkillPost[];
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<IUserProfile, string>({
      query: (id) => ({
        url: `/users/profile/${id}`,
        method: "GET",
      }),
      transformResponse: (response: IApiResponse<IUserProfile>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    updateMyProfile: builder.mutation<IUserProfile, Partial<IUserProfile>>({
      query: (payload) => ({
        url: `/users/update-profile`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_payload, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data as unknown as IUser }));
        } catch {
          // Let the mutation error path handle failures.
        }
      },
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateMyProfileMutation } = userApi;
