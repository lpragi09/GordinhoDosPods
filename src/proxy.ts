import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";
  const isAccountRoute =
    pathname.startsWith("/conta") || pathname.startsWith("/checkout");
  const isPublicAccountRoute =
    pathname === "/conta/entrar" ||
    pathname === "/conta/cadastro" ||
    pathname === "/conta/recuperar-senha" ||
    pathname.startsWith("/conta/redefinir-senha");

  if (isAdminRoute && !isAdminLogin) {
    if (!user || user.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (isAccountRoute && !isPublicAccountRoute) {
    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/conta/entrar";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/conta/:path*", "/checkout/:path*"],
};
