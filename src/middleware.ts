import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return NextResponse.json(
      { message: "Invalid authorization header" },
      { status: 401 }
    );
  }
    return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/expenses/:path*",
    "/api/category/:path*",
    "/api/budget/:path*",
    "/api/khata/:path*",
    "/api/profile/:path*",
    "/api/dashboard/:path*",
  ],
};