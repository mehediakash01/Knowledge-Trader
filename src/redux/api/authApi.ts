import { baseApi } from "@/redux/api/baseApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import type { IApiResponse, IUser } from "@/types";

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface IBackendUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  image?: string;
  tokenBalance?: number;
  ktBalance?: number;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

const normalizeUser = (user: IBackendUser): IUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  image: user.image,
  ktBalance: user.ktBalance ?? user.tokenBalance ?? 0,
});

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, ILoginRequest>({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
      transformResponse: (
        response: IApiResponse<{
          accessToken: string;
          refreshToken: string;
          user: IBackendUser;
        }>
      ) => ({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: normalizeUser(response.data.user),
      }),
      invalidatesTags: ["user"],
    }),
    register: builder.mutation<IUser, IRegisterRequest>({
      query: (payload) => ({
        url: "/users/register",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: IApiResponse<IBackendUser>) =>
        normalizeUser(response.data),
      invalidatesTags: ["user"],
    }),
    getMe: builder.query<IUser, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      transformResponse: (response: IApiResponse<IBackendUser>) =>
        normalizeUser(response.data),
      providesTags: ["user"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data }));
        } catch (err) {
          // If fetch fails, we don't necessarily want to logout here
          // as it might be a temporary network issue.
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
