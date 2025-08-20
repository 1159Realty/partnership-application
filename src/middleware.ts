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
  const session = await getServerSession();
  const fullPath = request.nextUrl.href.replace(WEB_APP_URL, "");
  const currentPath = `${WEB_APP_URL}${request.nextUrl.pathname}`;

  const role = getRole(session?.user?.roleId);
  const allowedRoleRoutes = [
    ...getRoleRoutes(role)
      .filter((x) => x.route !== ROUTES["/"])
      .map((x) => x.route),
    ROUTES["/profile"],
    ROUTES["/notifications"],
  ];

  const isSignedIn = Boolean(session);

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute(currentPath) && !isSignedIn) {
    return NextResponse.redirect(
      new URL(
        `${ROUTES["/404"]}?redirect=${encodeURIComponent(fullPath)}`,
        request.url
      )
    );
  }

  // TODO: Do not allow navigation to protected pages if onboarding is not complete!

  // Redirect signed-in users away from unprotected pages like /sign-in or /onboarding
  if (
    isUnprotectedRoute(currentPath) &&
    !isHomeRoute(request.nextUrl.pathname) &&
    isSignedIn
  ) {
    return NextResponse.redirect(new URL(ROUTES["/"], request.url));
  }

  // Redirect signed-in users trying to access protected routes they don’t have access to
  const isTryingDisallowedRoute =
    isProtectedRoute(currentPath) &&
    allowedRoleRoutes.every((r) => !currentPath.includes(WEB_APP_URL + r));

  if (
    isTryingDisallowedRoute &&
    !isHomeRoute(request.nextUrl.pathname) &&
    isSignedIn
  ) {
    return NextResponse.redirect(new URL(ROUTES["/"], request.url));
  }
}
