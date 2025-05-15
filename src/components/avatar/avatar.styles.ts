"use client";

import styled from "@emotion/styled";
import { Avatar } from "@mui/material";

interface StyledAvatarProps {
  height: string;
  width: string;
  border?: string;
}
export const StyledAvatar = styled(Avatar)<StyledAvatarProps>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  ${({ border }) => (border ? `border: ${border};` : "")}
`;
