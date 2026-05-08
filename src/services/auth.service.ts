const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_USER_KEY = "authUser";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const isBrowser = (): boolean => typeof window !== "undefined";

const getStorage = (): Storage | null => {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage;
};

const getToken = (key: string): string | null => {
  try {
    return getStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

const setToken = (key: string, token: string): void => {
  try {
    getStorage()?.setItem(key, token);
  } catch {
    // Storage can be unavailable in private modes or restricted browsers.
  }
};

const removeToken = (key: string): void => {
  try {
    getStorage()?.removeItem(key);
  } catch {
    // Storage can be unavailable in private modes or restricted browsers.
  }
};

const setCookie = (key: string, value: string): void => {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${key}=${encodeURIComponent(
    value
  )}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
};

const removeCookie = (key: string): void => {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${key}=; path=/; max-age=0; samesite=lax`;
};

export const authKey = {
  accessToken: ACCESS_TOKEN_KEY,
  refreshToken: REFRESH_TOKEN_KEY,
  authUser: AUTH_USER_KEY,
} as const;

export const getAccessToken = (): string | null => getToken(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string): void => {
  setToken(ACCESS_TOKEN_KEY, token);
  setCookie(ACCESS_TOKEN_KEY, token);
};

export const removeAccessToken = (): void => {
  removeToken(ACCESS_TOKEN_KEY);
  removeCookie(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => getToken(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string): void => {
  setToken(REFRESH_TOKEN_KEY, token);
};

export const removeRefreshToken = (): void => {
  removeToken(REFRESH_TOKEN_KEY);
  removeCookie(REFRESH_TOKEN_KEY);
};

export const getAuthUser = <TUser>(): TUser | null => {
  const rawUser = getToken(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as TUser;
  } catch {
    removeToken(AUTH_USER_KEY);
    return null;
  }
};

export const setAuthUser = <TUser>(user: TUser): void => {
  try {
    getStorage()?.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // Storage can be unavailable in private modes or restricted browsers.
  }
};

export const removeAuthUser = (): void => {
  removeToken(AUTH_USER_KEY);
};

export const setAuthTokens = ({
  accessToken,
  refreshToken,
}: {
  accessToken?: string | null;
  refreshToken?: string | null;
}): void => {
  if (accessToken === null) {
    removeAccessToken();
  } else if (accessToken) {
    setAccessToken(accessToken);
  }

  if (refreshToken === null) {
    removeRefreshToken();
  } else if (refreshToken) {
    setRefreshToken(refreshToken);
  }
};

export const removeAuthTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};

export const clearAuthStorage = (): void => {
  removeAuthTokens();
  removeAuthUser();
};
