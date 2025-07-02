"use client";
import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";
import Link from "next/link";

// PropertyDetail
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

export const PropertyCardDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  column-gap: 2px;
  margin-top: 16px;
`;

// Property Overview
export const PropertyOverviewKey = styled.div`
  font-family: Inter;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0px;
  color: ${COLORS.gray500};
`;

export const PropertyOverviewValue = styled.div`
  font-family: Inter;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0px;
  color: ${COLORS.gray900};
`;

// PropertyClient
export const PropertyClientCardWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 8px;
  border-bottom: 1px dashed ${COLORS.gray300};
`;

export const PropertyClientCardFlexItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  row-gap: 4px;
  flex-wrap: wrap;
`;

export const PropertyClientCardFlexItemValue = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
  margin-left: 10px;
`;
