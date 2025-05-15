"use client";
import React from "react";
import { Header } from "./Header";
import { ChildrenProps } from "@/utils/global-types";
import { DesktopSidePanel, MobileSidePanel } from "./SidePanel";
import { usePathname } from "next/navigation";
import { LayoutWrapper } from "@/styles/globals.styles";
import { LayoutChildrenWrapper, LayoutContentWrapper } from "./layout.styles";
import { BASE_URL, NO_LAYOUT_ROUTES, ROUTES } from "@/utils/constants";
import { useUserContext } from "@/contexts/UserContext";

const Layout = ({ children }: ChildrenProps) => {
  const { userData } = useUserContext();

  const pathname = usePathname();

  return NO_LAYOUT_ROUTES.some((r) => {
    if (pathname === "/") return false;
    return `${BASE_URL}${pathname}`.includes(`${BASE_URL}${r}`);
  }) ? (
    children
  ) : (
    <LayoutWrapper>
      <MobileSidePanel />
      <LayoutContentWrapper>
        <DesktopSidePanel />
        <LayoutChildrenWrapper>
          <Header avatarUrl={userData?.profilePic || ""} pathname={pathname as keyof typeof ROUTES} />
          {children}
        </LayoutChildrenWrapper>
      </LayoutContentWrapper>
    </LayoutWrapper>
  );
};

export default Layout;
