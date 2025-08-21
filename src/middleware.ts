import { NextRequest, NextResponse } from "next/server";
import {
  PROTECTED_ROUTES,
  ROUTES,
  UNPROTECTED_ROUTES,
  WEB_APP_URL,
} from "./utils/constants";
import { getServerSession } from "./lib/session/server";
import { getRole, getRoleRoutes } from "./lib/session/roles";

function isProtectedRoute(path: string) {
  return PROTECTED_ROUTES.some((r) => path.includes(WEB_APP_URL + r));
}

function isUnprotectedRoute(path: string) {
  return UNPROTECTED_ROUTES.some((r) => path.includes(WEB_APP_URL + r));
}

function isHomeRoute(pathname: string) {
  return pathname === ROUTES["/"];
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⛔ Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next") || // Next.js build files
    pathname.startsWith("/api") ||   // API routes
    pathname.startsWith("/static") || 
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(.*)$/)        // Any file with extension (.png, .jpg, .css, .js, etc.)
  ) {
    return NextResponse.next();
  }

  const session = await getServerSession();
  const fullPath = request.nextUrl.href.replace(WEB_APP_URL, "");
  const currentPath = `${WEB_APP_URL}${pathname}`;

  const role = getRole(session?.user?.roleId);
  const allowedRoleRoutes = [
    ...getRoleRoutes(role)
      .filter((x) => x.route !== ROUTES["/"])
      .map((x) => x.route),
    ROUTES["/profile"],
    ROUTES["/notifications"],
  ];

  const isSignedIn = Boolean(session);

  if (isProtectedRoute(currentPath) && !isSignedIn) {
    return NextResponse.redirect(
      new URL(`${ROUTES["/404"]}?redirect=${encodeURIComponent(fullPath)}`, request.url)
    );
  }

  if (
    isUnprotectedRoute(currentPath) &&
    !isHomeRoute(pathname) &&
    isSignedIn
  ) {
    return NextResponse.redirect(new URL(ROUTES["/"], request.url));
  }

  const isTryingDisallowedRoute =
    isProtectedRoute(currentPath) &&
    allowedRoleRoutes.every((r) => !currentPath.includes(WEB_APP_URL + r));

  if (isTryingDisallowedRoute && !isHomeRoute(pathname)) {
    return NextResponse.redirect(new URL(ROUTES["/"], request.url));
  }

  // Redirect every non-home route to "/"
  if (pathname !== ROUTES["/"]) {
    return NextResponse.redirect(new URL(ROUTES["/"], request.url));
  }

  return NextResponse.next();
}