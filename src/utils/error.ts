import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

import type { IApiError } from "@/types";

export const getApiErrorMessage = (
  error: FetchBaseQueryError | SerializedError | unknown
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null
  ) {
    const data = error.data as IApiError;
    const firstFieldError = data.errorSources?.[0]?.message;

    return firstFieldError || data.message || "Something went wrong";
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Something went wrong";
};
