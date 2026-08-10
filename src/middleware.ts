import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Protects everything under /admin/dashboard. Unauthenticated requests are
 * redirected to /admin/login (handled automatically by withAuth via the
 * `pages.signIn` option in authOptions). The login page itself and any
 * /api/auth/* routes stay public, per the matcher below.
 */
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
