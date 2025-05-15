import { Avatar } from "@/components/avatar";
import { Divider } from "@/components/divider";
import { Drawer } from "@/components/drawer";
import { StatusPillWithIcon } from "@/components/pills";
import { PageTitleBtn } from "@/components/utils";
import { getDateTimeString } from "@/services/dateTime";
import { MobileB2MGray600, MobileB2MGray800 } from "@/utils/typography";
import { Box, Stack } from "@mui/material";
import React from "react";
import { IInvoice } from "@/lib/api/invoice/invoice.types";
import { formatCurrency } from "@/services/numbers";
import { ROUTES } from "@/utils/constants";
import Link from "next/link";

interface InvoiceDetailProps {
  isOpen: boolean;
  onClose?: () => void;
  invoice: IInvoice | null;
}

function InvoiceDetail({ isOpen, onClose, invoice }: InvoiceDetailProps) {
  const enrollmentUrl = `${ROUTES["/enrollments"]}?enrollmentId=${invoice?.enrolment?.id}`;

  return (
    <Drawer isOpen={isOpen} handleClose={onClose}>
      <Box pb="48px" mt="60px">
        <Box px="16px">
          <PageTitleBtn hideCancel>Invoice #{invoice?.invoiceNum}</PageTitleBtn>
        </Box>

        <Stack mt="16px" spacing={"25px"}>
          <Stack px="16px" spacing={"4px"}>
            <MobileB2MGray600>Status</MobileB2MGray600>
            <MobileB2MGray800>
              <StatusPillWithIcon
                status={
                  invoice?.status === "PAID"
                    ? "success"
                    : invoice?.status === "CANCELLED"
                    ? "neutral"
                    : invoice?.status === "OVERDUE"
                    ? "danger"
                    : "warning"
                }
              />
            </MobileB2MGray800>
          </Stack>

          <Stack px="16px" spacing={"4px"}>
            <MobileB2MGray600>Amount</MobileB2MGray600>
            <MobileB2MGray800>{formatCurrency(invoice?.totalAmount)}</MobileB2MGray800>
          </Stack>

          <Stack px="16px" spacing={"4px"}>
            <MobileB2MGray600>Due date</MobileB2MGray600>
            <MobileB2MGray800>{getDateTimeString(invoice?.dueDate, "date-only")}</MobileB2MGray800>
          </Stack>

          <Stack px="16px" spacing={"4px"}>
            <MobileB2MGray600>Payment date</MobileB2MGray600>
            <MobileB2MGray800>
              {invoice?.paymentDate ? getDateTimeString(invoice?.paymentDate, "date-only") : "N/A"}
            </MobileB2MGray800>
          </Stack>

          <Divider />

          <Stack px="16px" spacing={"4px"}>
            <MobileB2MGray600>Enrollment</MobileB2MGray600>
            <Stack direction={"row"} alignItems={"center"} flexWrap={"wrap"}>
              <Link href={enrollmentUrl}>
                <Avatar src={invoice?.enrolment?.property?.propertyPic || ""} variant="rounded" sx={{ mr: "16px" }} size="48px" />
              </Link>
              <Link style={{ textDecoration: "underline" }} href={enrollmentUrl}>
                <MobileB2MGray800>{invoice?.enrolment?.property?.propertyName}</MobileB2MGray800>
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}

export { InvoiceDetail };
