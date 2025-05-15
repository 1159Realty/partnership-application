"use client";

import { COLORS } from "@/utils/colors";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

export const LayoutWrapper = styled.div``;

export const HiddenOnDesktop = styled(Box)`
  @media screen and (min-width: 769px) {
    display: none;
  }
  width: fit-content;
  height: fit-content;
`;
export const HiddenOnMobile = styled(Box)`
  @media screen and (max-width: 768px) {
    display: none;
  }
  width: fit-content;
  height: fit-content;
`;

export const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
`;

export const shakeAnimation = keyframes`
0% {transform: translateX(0);}
25% {transform: translateX(0px);}
75% {transform: translateX(5px);}
100% {transform: translateX(-5);}
`;

export const ShakeWrapper = styled(Box)`
  animation: ${shakeAnimation} 2s linear infinite;
`;

export const ImagesFlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 20px;
  row-gap: 25px;
  width: 100%;
  flex-wrap: wrap;

  @media screen and (min-width: 1074px) {
    column-gap: 25px;
  }
`;

export const ModulePageWrapper = styled.div`
  padding: 32px 16px;

  @media screen and (min-width: 769px) {
    padding: 48px 24px;
  }
`;

export const ButtonWithIconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  background-color: ${COLORS.gray200};
  padding: 12px 24px;
  cursor: pointer;

  svg {
    color: ${COLORS.gray800};
    margin-left: 10px;
  }
`;
