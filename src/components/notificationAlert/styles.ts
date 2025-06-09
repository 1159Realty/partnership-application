"use client";

import styled from "@emotion/styled";
import { motion } from "framer-motion";

export const AlertWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
`;

export const ContentWrapper = styled.div`
  cursor: pointer;
`;
