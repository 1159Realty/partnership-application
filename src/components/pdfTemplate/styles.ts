import { COLORS, SEVERITY_COLORS } from "@/utils/colors";
import styled from "@emotion/styled";
import { Box, Stack } from "@mui/material";

export const InvoiceWrapper = styled(Box)`
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
`;
export const InvoiceUpperSection = styled(Stack)`
  border-top: 0.5px solid #f5f5f5;
  border-bottom: 0.5px solid #f5f5f5;
  margin-bottom: 5px;
`;

export const PaymentWrapper = styled.div`
  padding: 5px;
  border-radius: 2px;
  background-color: #9dd89dd3;
  font-size: 10px;
  width: max-content;
  color: green;
  margin-top: 10px;
`;
export const MobilePBold = styled.div`
  font-size: 10px;
  font-weight: 500;
`;
export const MobilePLight = styled.div`
  font-size: 10px;
  color: ${COLORS.gray500};
`;
export const DateWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex-direction: row;
  margin-top: 10px;
`;
export const CalculationWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex-direction: row;
  margin-top: 10px;
  gap: 2px;
`;
export const BoxBorder = styled.div`
  border: 0.5px solid #f5f5f5;
`;

export const Header = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: ${COLORS.blackNormal};
`;

export const Subheader = styled.span`
  font-size: 12px;
  color: gray;
  text-align: right;
`;

export const Amount = styled.span`
  font-size: 22px;
  font-weight: bold;
`;

export const StyledDate = styled.span`
  font-size: 10px;
  color: gray;
`;

export const Label = styled.span`
  font-size: 10px;
  color: gray;
`;

export const Success = styled.span`
  font-size: 14px;
  color: green;
`;
export const Pending = styled.span`
  font-size: 14px;
  color: ${SEVERITY_COLORS.warning.dark};
`;

export const TotalLabel = styled.span`
  font-size: 12px;
  color: black;
  font-weight: bold;
`;

export const TotalAmount = styled.span`
  font-size: 12px;
  color: black;
  font-weight: normal;
`;

export const ReasonLabel = styled.span`
  font-size: 12px;
  color: black;
  font-weight: 500;
`;

export const ReasonValue = styled.span`
  font-size: 12px;
  color: gray;
  font-weight: 500;
`;

export const Phrase = styled.span`
  font-size: 10px;
  color: gray;
  font-weight: normal;
`;
