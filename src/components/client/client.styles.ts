"use client";
import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import Link from "next/link";

// Client Card
export const ClientCardWrapper = styled(Link)`
  height: 171px;
  width: 100%;
  background-color: ${COLORS.gray50};
  border-radius: 11px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  word-wrap: break-word;
  cursor: pointer;
`;

export const EmailFont = styled.span`
  font-family: Inter;
  font-weight: 500;
  font-size: 9px;
  line-height: 13.5px;
  letter-spacing: 0px;
  color: ${COLORS.gray500};
`;

//ClientInfo
export const ClientInfoWrapper = styled.span`
  display: flex;
  flex-direction: row;
  row-gap: 10px;
  flex-wrap: wrap;
  padding: 18px 16px;
  background-color: ${COLORS.whiteNormal};
  align-items: center;

  @media screen and (min-width: 768px) {
    padding: 32px 24px;
  }

  @media screen and (min-width: 769px) and (max-width: 950px) {
    align-items: flex-start;
  }
`;

export const ClientInfoTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 48px;
  flex-wrap: wrap;
  margin-left: 16px;

  @media screen and (min-width: 769px) and (max-width: 950px) {
    flex-direction: column;
    row-gap: 16px;
  }

  @media screen and (min-width: 651px) and (max-width: 768px) {
    flex-direction: row;
    row-gap: 16px;
  }

  @media screen and (max-width: 650px) {
    flex-direction: column;
    row-gap: 16px;
  }
`;

// Client Document
export const DocumentContainer = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.gray100};
  border-radius: 7px;
  padding: 8px;
`;

export const AddDocument = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  column-gap: 8px;
  margin-top: 26px;
  padding: 8px;
`;

// Client Pipeline

//Client transaction History Card
export const TransactionCardContainer = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 16px;
  border-bottom: 1px dashed ${COLORS.gray300};
  padding-bottom: 8px;
`;
export const AgentCommissionContainer = styled(Box)`
  border-left: 2px solid ${COLORS.greenNormal};
  padding-left: 3px;
`;
