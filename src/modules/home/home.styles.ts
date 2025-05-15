"use client";
import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";

export const HomeWrapper = styled.div`
  padding: 32px 16px;

  @media screen and (min-width: 769px) {
    padding: 48px 24px;
  }
`;

export const PropertyImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 312px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
`;

export const PropertyImageDetailWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 16px;
`;

export const InterestedOverviewKey = styled.div`
  font-family: Inter;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0px;
  color: ${COLORS.gray500};
`;

export const InterestedOverviewValue = styled.div`
  font-family: Inter;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0px;
  color: ${COLORS.gray900};
`;
