"use client";
import React, { useEffect } from "react";
import { ChildrenProps } from "@/utils/global-types";
import { usePathname } from "next/navigation";
import { LayoutWrapper } from "@/styles/globals.styles";
import { LayoutChildrenWrapper, LayoutContentWrapper } from "./layout.styles";
import { APP_VERSION, BASE_URL, NO_LAYOUT_ROUTES } from "@/utils/constants";
import { useSession } from "@/lib/session/client/useSession";

const Layout = ({ children }: ChildrenProps) => {
  const { logout } = useSession();

  const pathname = usePathname();

  useEffect(() => {
    const currentVersion = APP_VERSION;
    const storedVersion = localStorage.getItem("app_version");

    if (currentVersion && storedVersion !== currentVersion) {
      // Version mismatch — force sign-out
      localStorage.setItem("app_version", currentVersion);
      logout();
    }
  }, [logout]);

  return NO_LAYOUT_ROUTES.some((r) => {
    if (pathname === "/") return false;
    return `${BASE_URL}${pathname}`.includes(`${BASE_URL}${r}`);
  }) ? (
    children
  ) : (
    <LayoutWrapper>
      {/* <MobileSidePanel /> */}
      <LayoutContentWrapper>
        {/* <DesktopSidePanel /> */}
        <LayoutChildrenWrapper>
          {/* <Header avatarUrl={userData?.profilePic || ""} pathname={pathname as keyof typeof ROUTES} /> */}
          {children}
        </LayoutChildrenWrapper>
      </LayoutContentWrapper>
    </LayoutWrapper>
  );
};

export default Layout;
