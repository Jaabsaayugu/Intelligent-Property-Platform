import { getBackendUrl } from "@/lib/server-api";

async function forward(request: Request, path: string[]) {
  const url = new URL(request.url);
  const query = url.search || "";
  const targetUrl = `${getBackendUrl()}/api/${path.join("/")}${query}`;
  const rawBody = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "Content-Type": request.headers.get("content-type") ?? "application/json",
        ...(request.headers.get("authorization")
          ? { Authorization: request.headers.get("authorization") as string }
          : {}),
      },
      body: rawBody ? rawBody : undefined,
      cache: "no-store",
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      { message: "Cannot reach the backend server right now." },
      { status: 503 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return forward(request, path);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return forward(request, path);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return forward(request, path);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return forward(request, path);
}
