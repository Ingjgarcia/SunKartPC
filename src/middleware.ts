import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    // 1. Protection for Admin Dashboard (Only Super Admin and Business Admin)
    if (path.startsWith("/dashboard/admin")) {
      if (role !== "SUPER_ADMIN" && role !== "BUSINESS_ADMIN") {
        // Cashiers go to cashier POS, staff goes to scanner
        if (role === "CASHIER") {
          return NextResponse.redirect(new URL("/dashboard/cashier", req.url));
        }
        return NextResponse.redirect(new URL("/dashboard/scanner", req.url));
      }
    }

    // 2. Protection for Cashier POS (Admins and Cashiers only)
    if (path.startsWith("/dashboard/cashier")) {
      if (role !== "SUPER_ADMIN" && role !== "BUSINESS_ADMIN" && role !== "CASHIER") {
        return NextResponse.redirect(new URL("/dashboard/scanner", req.url));
      }
    }

    // 3. Protection for Scanner (Admins, Cashiers and Staff)
    if (path.startsWith("/dashboard/scanner")) {
      if (!role) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
