"use client";

import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";
import { Button, Chip, IconButton as MuiIconButton } from "@mui/material";
import Link from "next/link";
import { darken } from "polished";

interface IconButtonProps {
  bg_color?: string;
  custom_size?: string;
}
export const StyledIconButton = styled(MuiIconButton)<IconButtonProps>`
  background: ${({ bg_color }) => bg_color || COLORS.gray100};
  ${({ custom_size }) => (custom_size ? `height: ${custom_size}; width: ${custom_size};` : "")}

  &:hover {
    background: ${({ bg_color }) => darken(0.01, bg_color || COLORS.gray100)}; // Darken color for hover
  }
`;

interface StyledChipProps {
  bg_color?: string;
}
export const StyledChip = styled(Chip)<StyledChipProps>`
  background: ${({ bg_color }) => bg_color || COLORS.gray100};

  &:hover {
    background: ${({ bg_color }) => darken(0.01, bg_color || COLORS.gray100)}; // Darken color for hover
  }
`;

interface StyledButtonProps {
  not_rounded?: "true" | "false";
}

export const StyledButton = styled(Button)<StyledButtonProps>`
  border-radius: ${({ not_rounded }) => (not_rounded === "true" ? "5px" : "40px")};
`;
export const ArrowBackButton = styled.div`
  padding: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${COLORS.gray100};
  margin-left: 50px;
  margin-top: 20px;
  cursor: pointer;
  :active {
    background-color: ${COLORS.gray300};
  }

  @media screen and (max-width: 769px) {
    margin-left: 10px;
  }
`;

// Loading button
export const StyledLoadingButton = styled(LoadingButton)<StyledButtonProps>`
  border-radius: ${({ not_rounded }) => (not_rounded === "true" ? "5px" : "40px")};
`;

// Loading button
export const GoogleButtonWrapper = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  padding: 8px 10px;
  border: 2px solid ${COLORS.gray200};
  border-radius: 5px;
  width: 100%;
  cursor: pointer;

  span {
    color: black;
    font-size: 16px;
  }
`;
