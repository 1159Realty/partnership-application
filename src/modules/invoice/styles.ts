"use client";
import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const ClientCardWrapper = styled(Box)`
  height: 129px;
  width: 100%;
  background-color: ${COLORS.gray50};
  border-radius: 11px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  word-wrap: break-word;

  @media screen and (max-width: 768px) {
    height: 110px;
  }
`;

export const InvoiceDetailButtonsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  row-gap: 10px;

  @media screen and (max-width: 370px) {
    flex-direction: column;
  }
`;
