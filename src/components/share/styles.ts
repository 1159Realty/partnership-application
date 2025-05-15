"use client";
import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const ShareWrapper = styled(Box)`
  position: relative;
  width: fit-content;
  height: fit-content;
`;
export const CopyWrapper = styled(Box)`
  position: absolute;
  padding: 5px 10px;
  background: ${COLORS.whiteNormal};
  border-radius: 10px;
  top: 20px;
  right: 10px;
  color: black;
  font-size: 10px;
  box-shadow: 0px 5px 16px 0px rgba(8, 15, 52, 0.2);
  text-transform: capitalize;
`;
