import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicPaths = ["/", "/login", "/register"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value; // or read from headers/localStorage via client

  // Allow public paths
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

// document.cookie = `auth_token=${token}; path=/; SameSite=Strict; Max-Age=3600`;


  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwtDecode<{ role: string }>(token);
    const role = decoded.role.toLowerCase();

    const pathname = request.nextUrl.pathname;

    // Role-based route protection (very basic example)
    if (pathname.startsWith("/buyer") && role !== "buyer") {
      return NextResponse.redirect(new URL("/login?unauthorized=true", request.url));
    }
    if (pathname.startsWith("/seller") && role !== "seller") {
      return NextResponse.redirect(new URL("/login?unauthorized=true", request.url));
    }
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login?unauthorized=true", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid token → logout & redirect
    const response = NextResponse.redirect(new URL("/login?session=invalid", request.url));
    response.cookies.delete("auth_token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
