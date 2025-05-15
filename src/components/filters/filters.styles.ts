"use client";

import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";
import { transparentize } from "polished";

export const FilterHeader = styled.div`
  display: flex;
  column-gap: 16px;
  align-items: center;
  flex-direction: row;
  margin-bottom: 23px;
`;

export const FilterFieldsWrapper = styled.div`
  display: flex;
  row-gap: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 30px;
`;

export const FilterFlexWrappers = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-direction: row;
  margin-bottom: 23px;
  justify-content: space-between;
`;

interface FilterIconContainerProps {
  is_active: "in-active" | "active";
}
export const FilterIconContainer = styled.div<FilterIconContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  background-color: ${({ is_active }) => (is_active === "active" ? transparentize(0.8, "#2196F3") : COLORS.gray200)};
  padding: 12px 24px;
  cursor: pointer;

  svg {
    color: ${COLORS.gray800};
    margin-left: 10px;
  }

  @media screen and (max-width: 768px) {
    width: 46px;
    height: 46px;
    padding: 0;

    svg {
      margin-left: 0;
    }
  }
`;
