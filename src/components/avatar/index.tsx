import React from "react";
import { StyledAvatar } from "./avatar.styles";
import { AvatarProps } from "@mui/material";

interface Props extends AvatarProps {
  size?: string;
  border?: string;
}
function Avatar({ size = "20px", border, ...props }: Props) {
  return <StyledAvatar height={size} width={size} border={border} {...props} />;
}

export { Avatar };
