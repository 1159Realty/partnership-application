"use client";

import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

export const DialogBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DialogContentWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  pointer-events: none;
`;

export const DialogContent = styled.div`
  max-width: 500px;
  padding: 20px;

  @media screen and (min-width: 470px) and (max-width: 768px) {
    max-width: 400px;
  }
  @media screen and (min-width: 390px) and (max-width: 469px) {
    max-width: 350px;
    margin: 0;
  }
  @media screen and (min-width: 320px) and (max-width: 389px) {
    max-width: 300px;
    padding: 20px 10px;
  }
  @media screen and (max-width: 319px) {
    max-width: 270px;
    padding: 20px 10px;
  }
`;

export const ModalCloseBtn = styled(motion.div)`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: transparent;
  border: none;
`;

interface GenericDialogContentWrapperProps {
  dynamicMaxWidth?: string;
}
export const GenericDialogWrapper = styled.div<GenericDialogContentWrapperProps>`
  max-width: ${({ dynamicMaxWidth }) => dynamicMaxWidth || "400px"};
  margin: auto;
  width: 90%;
  background-color: ${COLORS.whiteNormal};
  border-radius: 10px;
  padding: 20px;
  pointer-events: auto;
`;

// Onboarding
export const OnboardingDialogWrapper = styled.div`
  padding-top: 30px;
  padding-bottom: 10px;
`;

export const OnboardingDialogEditIconWrapper = styled.div`
  width: 50px;
  height: 50px;
  padding: 10px;
  border-radius: 50%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const OnboardingDialogMessage = styled.div`
  font-family: Inter;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0px;
  text-align: center;
  color: ${COLORS.gray700};
  margin-top: 8px;
`;

export const OnboardingDialogTitle = styled.div`
  font-family: Inter;
  font-weight: 600;
  font-size: 21px;
  line-height: 26.25px;
  letter-spacing: 0px;
  text-align: center;
  color: ${COLORS.gray900};
`;
