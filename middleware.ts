import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin pages (not /api/admin/auth which is the login endpoint)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // If no valid token, let the page render — it will show the login form client-side
    // The API routes do their own auth check
    if (!token || token !== adminPassword) {
      // Allow the page to load — the client-side component handles the login gate
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
