"use client";

import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";

export const SupportMainWrapper = styled.div`
  padding: 16px;
`;
export const SupportHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 10px;
  margin-bottom: 32.5px;
`;
export const StatusWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 32px;
  flex-wrap: wrap;
  row-gap: 10px;
`;

// Support Card
export const SupportCardWrapper = styled.div`
  width: 100%;
  background-color: ${COLORS.gray100};
  border-radius: 14px;
  padding: 8px;
`;
export const SupportCardContentWrapper = styled.div`
  width: 100%;
  background-color: ${COLORS.whiteNormal};
  border-radius: 14px;
  padding: 16px;
`;
export const SupportCardContentText = styled.div`
  width: 100%;
  min-height: 80px;
`;
