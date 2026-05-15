const LOCAL_BACKEND_ORIGIN = "http://localhost:5000";
const RENDER_BACKEND_ORIGIN = "https://intelligent-property-platform.onrender.com";

function normalizeUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function withoutApiSuffix(url: string) {
  return normalizeUrl(url).replace(/\/api$/, "");
}

function getDefaultBackendOrigin() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return LOCAL_BACKEND_ORIGIN;
    }
  }

  return process.env.NODE_ENV === "production"
    ? RENDER_BACKEND_ORIGIN
    : LOCAL_BACKEND_ORIGIN;
}

export function getBackendOrigin() {
  const configuredUrl =
    process.env.BACKEND_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL;

  return configuredUrl
    ? withoutApiSuffix(configuredUrl)
    : getDefaultBackendOrigin();
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL
    ? normalizeUrl(process.env.NEXT_PUBLIC_API_URL)
    : `${getBackendOrigin()}/api`;
}
