import { forwardJsonRequest } from "@/lib/server-api";

export async function POST(request: Request) {
  const body = await request.json();

  return forwardJsonRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
