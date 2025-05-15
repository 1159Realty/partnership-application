"use client";

import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const PillWrapper = styled(Box)`
  border-radius: 100px;
  padding: 4px 8px;
  font-family: Inter;
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StatusPillWrapper = styled(Box)`
  border-radius: 5px;
  padding: 4px 8px;
  font-family: Inter;
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ButtonPillWrapper = styled(Box)`
  border-radius: 5px;
  padding: 6px 8px;
  font-family: Inter;
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

// PillWithBadge

export const PillWithBadgeWrapper = styled(Box)<{ isActive: boolean }>`
  background: ${(props) => (props.isActive ? COLORS.blackNormal : COLORS.whiteNormal)};
  cursor: pointer;
  color: ${(props) => (props.isActive ? COLORS.whiteNormal : COLORS.blackNormal)};
  transition: background-color 0.3s ease-in-out;
  border: 2px solid ${COLORS.gray900};
  padding: 8px 15px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  min-height: 37px;
  gap: 8px;
  font-size: 12px;
`;

export const PillBadge = styled.h3`
  font-size: 10px;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background-color: ${COLORS.redCustom1};
  color: ${COLORS.whiteNormal};
`;
