import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "@/redux/api/baseApi";
import { rootReducer } from "@/redux/rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
