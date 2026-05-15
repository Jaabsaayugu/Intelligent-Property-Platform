import { getBackendOrigin } from "@/lib/api-url";

export function getBackendUrl() {
  return getBackendOrigin();
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
          "Cannot reach the backend server. Check BACKEND_URL, API_URL, or NEXT_PUBLIC_API_URL.",
      },
      { status: 503 }
    );
  }
}
