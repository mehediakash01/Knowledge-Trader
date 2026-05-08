import { combineReducers } from "@reduxjs/toolkit";

import { baseApi } from "@/redux/api/baseApi";
import authReducer from "@/redux/features/auth/authSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
