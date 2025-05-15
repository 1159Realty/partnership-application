"use client";

import styled from "@emotion/styled";
import { motion } from "framer-motion";

import { COLORS } from "@/utils/colors";

export const DrawerWrapper = styled(motion.div)`
  position: fixed;
  right: 0;
  background-color: ${COLORS.gray50};
  overflow-y: auto;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;

  @media screen and (min-width: 769px) {
    width: 400px;
    top: 0;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
    bottom: 0;
  }
`;
