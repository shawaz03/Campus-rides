import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect student dashboard routes from unauthenticated access
  if (pathname.startsWith("/student")) {
    const allCookies = request.cookies.getAll();
    const hasAuthCookie = allCookies.some(
      (c) => c.name.startsWith("sb-") && c.name.includes("auth-token")
    );

    if (!hasAuthCookie) {
      const loginUrl = new URL("/auth", request.url);
      const response = NextResponse.redirect(loginUrl);
      // Ensure browser and CDNs never cache the protected page or the redirect
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      response.headers.set("Pragma", "no-cache");
      return response;
    }
  }

  const response = NextResponse.next();
  if (pathname.startsWith("/student")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: ["/student/:path*"],
};
