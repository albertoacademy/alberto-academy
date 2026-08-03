import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

const publicPaths = new Set([
  "/",
  "/about",
  "/programs",
  "/testimonials",
  "/pricing",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/login",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const possibleLocale = segments[0];

  if (isLocale(possibleLocale)) {
    const internalPath = `/${segments.slice(1).join("/")}` || "/";
    if (!publicPaths.has(internalPath)) return NextResponse.next();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-alberto-locale", possibleLocale);
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = internalPath;

    return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
  }

  if (publicPaths.has(pathname)) {
    const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;
    const locale = isLocale(savedLocale) ? savedLocale : defaultLocale;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|admin(?:/|$)|api(?:/|$)).*)"],
};
