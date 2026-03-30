const DEFAULT_BACKEND_URL = "http://localhost:5000";

export function getBackendUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    DEFAULT_BACKEND_URL
  ).replace(/\/+$/, "");
}

export async function forwardJsonRequest(
  path: string,
  init: RequestInit = {}
) {
  const targetUrl = `${getBackendUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const response = await fetch(targetUrl, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      {
        message:
          "Cannot reach the backend server. Make sure the API is running on http://localhost:5000.",
      },
      { status: 503 }
    );
  }
}
