import React from "react";
import { HeaderWrapper } from "./layout.styles";
import Link from "next/link";
import { MenuIcon } from "./ClientUtils";
import { Avatar } from "../avatar";
import { COLORS } from "@/utils/colors";
import { Badge, Stack } from "@mui/material";
import { Bell } from "@phosphor-icons/react/dist/ssr";
import { IconButton } from "../buttons";
import { Tooltip } from "../tooltip";
import { ROUTES } from "@/utils/constants";
import { useNotificationContext } from "@/contexts/NotificationContext";

interface HeaderProps {
  avatarUrl: string;
  pathname: keyof typeof ROUTES;
}

const Header = ({ avatarUrl, pathname }: HeaderProps) => {
  const { unreadCount } = useNotificationContext();
  return (
    <HeaderWrapper>
      <MenuIcon />

      <Stack direction={"row"} alignItems={"center"} spacing={"20px"}>
        <Tooltip title="Notifications">
          <Link href={"/notifications"}>
            <IconButton bg_color={pathname === "/notifications" ? COLORS.greenNormal : undefined} custom_size="45px">
              <Badge badgeContent={pathname === "/notifications" ? 0 : unreadCount} color="secondary">
                <Bell color="black" weight="bold" />
              </Badge>
            </IconButton>
          </Link>
        </Tooltip>

        <Tooltip title="Profile">
          <Link href={"/profile"}>
            <Avatar
              src={avatarUrl}
              size="45px"
              border={pathname === "/profile" ? `2px solid ${COLORS.greenNormal}` : undefined}
            />
          </Link>
        </Tooltip>
      </Stack>
    </HeaderWrapper>
  );
};

export { Header };
