const DEFAULT_API_PATH = "/api/v1";

const getBrowserOrigin = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.origin;
};

export const resolveApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  const browserOrigin = getBrowserOrigin();
  return browserOrigin ? `${browserOrigin}${DEFAULT_API_PATH}` : DEFAULT_API_PATH;
};

export const resolveSocketBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  const apiBaseUrl = resolveApiBaseUrl();
  if (apiBaseUrl.endsWith(DEFAULT_API_PATH)) {
    return apiBaseUrl.slice(0, -DEFAULT_API_PATH.length);
  }

  return getBrowserOrigin() || "http://localhost:5000";
};