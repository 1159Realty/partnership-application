import React from "react";
import { IconButtonProps } from "@mui/material";

// Styles
import { StyledIconButton } from "./button.styles";

interface Props extends IconButtonProps {
  bg_color?: string;
  custom_size?: string;
}

const IconButton = ({ children, ...props }: Props) => {
  return <StyledIconButton {...props}>{children}</StyledIconButton>;
};

export { IconButton };
