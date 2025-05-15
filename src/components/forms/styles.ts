"use client";

import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";

// BankAccount
export const BankAccountDialogWrapper = styled.div`
  padding-top: 30px;
  padding-bottom: 10px;
`;

export const BankAccountDialogEditIconWrapper = styled.div`
  width: 60px;
  height: 60px;
  padding: 10px;
  border-radius: 50%;
  background-color: ${COLORS.gray200};
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BankAccountDialogMessage = styled.div`
  font-family: Inter;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0px;
  text-align: center;
  color: ${COLORS.gray700};
  margin-top: 8px;
`;

export const BankAccountDialogTitle = styled.div`
  font-family: Inter;
  font-weight: 600;
  font-size: 21px;
  line-height: 26.25px;
  letter-spacing: 0px;
  text-align: center;
  color: ${COLORS.gray900};
`;
