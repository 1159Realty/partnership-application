"use client";

import { List, User } from "@phosphor-icons/react/dist/ssr";

import { COLORS } from "@/utils/colors";

import { HiddenOnDesktop } from "@/styles/globals.styles";

import { IconButton } from "@/components/buttons";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { MouseEvent, useState } from "react";
import { Popper } from "../popper";
import { Box } from "@mui/material";

export function MenuIcon() {
  const { setShowMenu } = useGlobalContext();

  const handleClick = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    <HiddenOnDesktop>
      <IconButton onClick={handleClick} aria-label="Menu Icon">
        <List color={COLORS.blackNormal} />
      </IconButton>
    </HiddenOnDesktop>
  );
}

export function MenuAvatar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<SVGSVGElement, globalThis.MouseEvent>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAnchorEl(event.currentTarget as any);
  };

  return (
    <div>
      <User onClick={handleClick} cursor={"pointer"} weight="fill" />
      <Popper anchorEl={anchorEl}>
        <Box color={"red"} bgcolor={"blue"}>
          Click me
        </Box>
      </Popper>
    </div>
  );
}
