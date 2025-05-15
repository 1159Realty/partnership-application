import { CircularProgress, Stack } from "@mui/material";
import React from "react";

interface SpinnerProps {
  width?: string;
  height?: string;
}

function Spinner({ width, height }: SpinnerProps) {
  return (
    <Stack width={width || "100%"} height={height || "70vh"} justifyContent={"center"} alignItems={"center"}>
      <CircularProgress color="secondary" />
    </Stack>
  );
}

export { Spinner };
