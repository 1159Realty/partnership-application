import React from "react";
import { ChipProps } from "@mui/material";

// Styles
import { StyledChip } from "./button.styles";

interface Props extends ChipProps {
  bg_color?: string;
}

const Chip = ({ children, ...props }: Props) => {
  return <StyledChip {...props}>{children}</StyledChip>;
};

export { Chip };
