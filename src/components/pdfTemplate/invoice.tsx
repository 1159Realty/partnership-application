"use client";

import { Box, Stack } from "@mui/material";
import Image from "next/image";
import Logo from "../../assets/images/logo.svg";
import {
  Amount,
  Header,
  InvoiceWrapper,
  Pending,
  Phrase,
  ReasonLabel,
  ReasonValue,
  StyledDate,
  Subheader,
  Success,
} from "./styles";
import { Drawer } from "../drawer";
import { Button } from "../buttons";
import { IInvoice } from "@/lib/api/invoice/invoice.types";
import { formatCurrency } from "@/services/numbers";
import { getDateTimeString } from "@/services/dateTime";
import { getUserName } from "@/services/string";
import { COLORS } from "@/utils/colors";
import { useInvoice } from "@/lib/api/invoice/useInvoice";
import { useAlertContext } from "@/contexts/AlertContext";
import { generateInvoicePDF } from "@/services/pdf/generateInvoice";
import { paystackPopup } from "@/services/payment/paystack";
import { useUserContext } from "@/contexts/UserContext";
import { Tooltip } from "../tooltip";

interface InvoiceTemplateProps {
  isOpen: boolean;
  onClose?: () => void;
  makePayment?: (invoice?: IInvoice | null) => void;
  invoice: IInvoice | null;
}

function InvoiceTemplate({ isOpen, onClose, makePayment, invoice }: InvoiceTemplateProps) {
  const { makeInvoicePayment } = useInvoice();

  const { userData } = useUserContext();
  const { setAlert } = useAlertContext();

  const today = new Date().toISOString();
  const isPaid = invoice?.status === "PAID";
  const statusMessage = isPaid ? "Payment Successful" : "Payment Pending";
  const customerName = getUserName(userData);
  const propertyName = invoice?.enrolment?.property?.propertyName || "-";

  const previousNotPaid = invoice?.previousNotPaid;
  const paymentDisabledMessage = previousNotPaid
    ? "Resolve the previous month's invoice"
    : isPaid
    ? "Payment has already been made!"
    : "";

  async function onPayment() {
    if (!invoice?.id) return;

    const response = await makeInvoicePayment(invoice?.id);
    if (response?.access_code) {
      paystackPopup.newTransaction({
        accessCode: response.access_code,
        onClose: () => {
          setAlert({
            message: "Payment cancelled",
            severity: "error",
            show: true,
          });
        },
        callback: () => {
          setAlert({
            message: "Payment successful",
            severity: "success",
            show: true,
          });

          makePayment?.(invoice);
          onClose?.();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }
  }

  function handelDownload() {
    if (!invoice) return;
    generateInvoicePDF(invoice, userData);
  }

  return (
    <Drawer isOpen={isOpen} handleClose={onClose}>
      <Box pb="48px" mt="60px">
        <Stack px="20px">
          <InvoiceWrapper>
            <Box width={"100%"}>
              <Stack direction={"row"} justifyContent={"space-between"} width={"100%"} mb="20px">
                <Image alt="Logo" width={40} height={40} src={Logo} />
                <Box display={"flex"} justifyContent={"flex-end"} alignItems={"flex-end"} flexDirection={"column"}>
                  <Header>{isPaid ? "RECEIPT" : "INVOICE"}</Header>
                  <Subheader>#{invoice?.invoiceNum}</Subheader>
                </Box>
              </Stack>

              <Stack my="30px" justifyContent={"center"} textAlign={"center"} spacing={"5px"}>
                <Amount>{formatCurrency(invoice?.amount)}</Amount>
                {isPaid ? <Success>{statusMessage}</Success> : <Pending>{statusMessage}</Pending>}
                <StyledDate>{getDateTimeString(today)}</StyledDate>
              </Stack>

              <Stack margin="10px 0">
                <Stack mb="20px" spacing={"10px"}>
                  <Stack pb="5px" borderBottom={"1px solid gray"} direction={"row"} alignItems={"center"} spacing={"20px"}>
                    <ReasonLabel>Customer</ReasonLabel>
                    <ReasonLabel>Property Name</ReasonLabel>
                  </Stack>
                  <Stack pb="5px" borderBottom={"1px solid gray"} direction={"row"} alignItems={"center"} spacing={"20px"}>
                    <ReasonValue>{customerName}</ReasonValue>
                    <ReasonValue>{propertyName}</ReasonValue>
                  </Stack>
                </Stack>

                <Stack alignItems={"flex-end"} justifyContent={"flex-end"}>
                  <Stack minWidth={200}>
                    <Stack pb="10px" direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                      <ReasonLabel>Amount</ReasonLabel>
                      <ReasonValue>{formatCurrency((invoice?.amount || 0) - (invoice?.interestAmount || 0))}</ReasonValue>
                    </Stack>
                    <Stack pb="10px" direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                      <ReasonLabel>Interest</ReasonLabel>
                      <ReasonValue>{formatCurrency(invoice?.interestAmount)}</ReasonValue>
                    </Stack>
                    <Stack pb="10px" direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                      <ReasonLabel>Overdue</ReasonLabel>
                      <ReasonValue>{formatCurrency(invoice?.overDueAmount)}</ReasonValue>
                    </Stack>
                    <Stack
                      borderBottom={`2px solid ${COLORS.greenNormal}`}
                      borderTop={`2px solid ${COLORS.greenNormal}`}
                      py="5px"
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <ReasonLabel>Total</ReasonLabel>
                      <ReasonValue>{formatCurrency(invoice?.totalAmount)}</ReasonValue>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            <Box textAlign={"center"} mt="40px" borderTop={"1px dashed gray"}>
              <Phrase>Thank you for choosing 1159 Realty as your trusted real estate partner.</Phrase>
            </Box>
          </InvoiceWrapper>

          <Stack mt="20px" direction={"row"} alignItems={"center"} spacing={"10px"}>
            <Tooltip title={paymentDisabledMessage}>
              <Box width={"100%"}>
                <Button disabled={isPaid || invoice?.previousNotPaid} onClick={onPayment} fullWidth>
                  Make payment
                </Button>
              </Box>
            </Tooltip>
            <Box width={"100%"}>
              <Button onClick={handelDownload} fullWidth variant="outlined">
                Download
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}

export { InvoiceTemplate };
