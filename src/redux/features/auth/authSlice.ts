import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  clearAuthStorage,
  removeAuthUser,
  setAuthTokens,
  setAuthUser,
} from "@/services/auth.service";
import type { IAuthPayload, IAuthState, IUser } from "@/types/auth";

const initialState: IAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
    setCredentials: (state, action: PayloadAction<IAuthPayload>) => {
      const { user, accessToken, refreshToken } = action.payload;

      if (user !== undefined) {
        state.user = user;

        if (user) {
          setAuthUser(user);
        } else {
          removeAuthUser();
        }
      }

      if (accessToken !== undefined) {
        state.accessToken = accessToken;
      }

      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
      }

      setAuthTokens({ accessToken, refreshToken });
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      clearAuthStorage();
    },
  },
});

export const { logout, setCredentials, setUser } = authSlice.actions;

export default authSlice.reducer;
