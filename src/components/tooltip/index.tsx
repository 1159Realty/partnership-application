import React from "react";
import { Tooltip as MuiTooltip, TooltipProps } from "@mui/material";

function Tooltip(props: TooltipProps) {
  return <MuiTooltip enterTouchDelay={10} {...props} />;
}

export { Tooltip };
