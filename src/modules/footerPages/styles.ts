"use client";

import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { span } from "framer-motion/client";

export const PrivacyWrapper = styled(Box)`
  width: 90%;
  margin: auto;
  margin-top: 20px;

  @media screen and (min-width: 769px) {
    margin-top: 40px;
  }
`;
export const ContentHeader = styled(Box)`
  margin: 22px 0;
  line-height: 27px;
  font-weight: 500;
  font-size: 21px;
  color: ${COLORS.blackActive};
`;
export const Span = styled(span)`
  margin-bottom: 10px;
  line-height: 27px;
  font-weight: 500;
  font-size: 14px;
  color: ${COLORS.blackActive};
`;
export const ContentDescription = styled(Box)`
  margin-bottom: 10px;
  line-height: 27px;
  font-weight: 500;
  font-size: 14px;
  color: #666d80;
`;
export const ListItem = styled.li`
  margin-bottom: 10px;
`;
