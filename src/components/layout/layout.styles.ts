"use client";

import styled from "@emotion/styled";
import { motion } from "framer-motion";
import Link from "next/link";
import { lighten } from "polished";

import { COLORS } from "@/utils/colors";

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  padding-top: 32px;
  border: 1px solid ${COLORS.gray100};

  @media screen and (min-width: 769px) {
    padding: 24px;
    padding-top: 48px;
    justify-content: flex-end;
  }
`;

export const ProfileIconWrapper = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  svg {
    transform: translateY(4px);
    color: ${COLORS.gray500};
  }
`;

export const StyledMobileSidePanel = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 84.3%;
  height: 100%;
  background-color: ${COLORS.gray50};
  overflow-y: auto;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media screen and (min-width: 769px) {
    display: none;
  }
`;

export const StyledDesktopSidePanel = styled(motion.div)`
  position: sticky;
  top: 0;
  left: 0;
  width: 37%;
  max-width: 300px;
  background-color: ${COLORS.gray50};
  overflow-y: auto;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const SidePanelWrapper = styled(motion.div)`
  position: relative;
  padding: 16px;
  padding-top: 32px;

  img {
    border-radius: 5px;
  }

  @media screen and (min-width: 769px) {
    padding: 24px;
    padding-top: 48px;
  }
`;

export const PanelItemsWrapper = styled.div`
  display: flex;
  row-gap: 16px;
  flex-direction: column;
  margin-top: 32px;
`;

interface StyledPanelItemProps {
  active?: "true" | "false";
}

export const StyledPanelItem = styled(Link)<StyledPanelItemProps>`
  border-radius: 100px;
  padding: 8px 16px;
  background-color: ${({ active }) => (active === "true" ? COLORS.greenNormal : "transparent")};
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${({ active }) => (active === "true" ? COLORS.greenNormal : lighten(0.2, COLORS.greenNormal))};
  }

  svg {
    display: inline-block;
    margin-right: 8.36px;
    color: ${({ active }) => (active === "true" ? COLORS.gray900 : COLORS.gray700)};
  }
`;

export const LayoutContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const LayoutChildrenWrapper = styled.div`
  width: 63%;
  flex-grow: 1;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const SidePanelFooter = styled.div`
  position: sticky;
  bottom: 20px;
  left: 0;
`;

interface SidePanelFooterItemProps {
  active?: "true" | "false";
}

export const SidePanelFooterLinks = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 10px;
  margin-top: 30px;
`;

export const SidePanelFooterLink = styled(Link)<SidePanelFooterItemProps>`
  font-family: Inter;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0px;
  color: ${({ active }) => (active === "true" ? COLORS.greenNormalActive : COLORS.gray500)};
  text-decoration: underline;
  margin-right: 10px;
`;
export const SideLinkWrapper = styled.div`
  align-items: center;
`;
