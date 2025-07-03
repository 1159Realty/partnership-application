import { addCommas } from "@/services/numbers";
import {
  Font7001421Gray900,
  MobileB1LightGray900,
  MobileB2MGray900,
  MobileCap2MGray500,
  MobileCap2MGray600,
  MobileCap2MGray900,
} from "@/utils/typography";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AgentCommissionContainer, TransactionCardContainer } from "./client.styles";
import { ButtonPill, StatusPill } from "../pills";
import { Check, CheckSquare } from "@phosphor-icons/react/dist/ssr";
import { useUserContext } from "@/contexts/UserContext";
import { getIsModerator, hasPermission } from "@/lib/session/roles";
import { useInvoice } from "@/lib/api/invoice/useInvoice";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IInvoice } from "@/lib/api/invoice/invoice.types";
import { Pagination } from "../pagination";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { getDateTimeString } from "@/services/dateTime";
import { COLORS, Severity } from "@/utils/colors";
import { Spinner } from "../loaders";
import { getUserName } from "@/services/string";
import { Tooltip } from "../tooltip";
import { ConfirmationDialog } from "../dialog/Confirmation";
import { Receipt } from "@phosphor-icons/react";
import { InvoiceTemplate } from "../pdfTemplate/invoice";
import { User } from "@/lib/api/user/user.types";

interface ClientTransactionHistoryProps {
  enrollment: IEnrollment | null;
}

function ClientTransactionHistory({ enrollment }: ClientTransactionHistoryProps) {
  const { fetchInvoices, resolveInvoicePayment } = useInvoice();

  const { userData } = useUserContext();

  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<PaginatedResponse<IInvoice> | null>(null);

  const [resolvePaymentId, setResolvePaymentId] = useState<string | null>(null);
  const [resolvingPayment, setResolvingPayment] = useState(false);
  const [reload, setReload] = useState(false);

  const [page, setPage] = useState(1);

  async function onResolvePayment() {
    if (!resolvePaymentId) return;
    setResolvingPayment(true);
    const res = await resolveInvoicePayment(resolvePaymentId);

    if (res) {
      setReload(!reload);
      setResolvePaymentId(null);
    }
    setResolvingPayment(false);
  }
  function handleResolvePayment(id?: string) {
    if (!id) return;
    setResolvePaymentId(id);
  }

  function handleUpdateInvoices() {
    setReload(!reload);
  }

  useEffect(() => {
    async function getInvoices() {
      if (!enrollment?.id) {
        setInvoiceData(null);
        return;
      }
      setLoading(true);
      const response = await fetchInvoices({ enrollmentId: enrollment?.id, page, limit: 5 });
      setInvoiceData(response);
      setLoading(false);
    }

    getInvoices();
  }, [enrollment?.id, fetchInvoices, page, reload]);

  return (
    <Box>
      {loading ? (
        <Spinner height="100px" />
      ) : (
        <Stack px="16px">
          <Stack spacing={"5px"}>
            <MobileB1LightGray900>
              <span style={{ fontWeight: "700" }}>Total Amount:</span>{" "}
              {enrollment?.totalAmount ? `₦${addCommas(enrollment.totalAmount)}` : ""}
            </MobileB1LightGray900>
            <MobileB1LightGray900>
              <span style={{ fontWeight: "700" }}>Balance Left:</span>{" "}
              {enrollment?.balanceLeft ? `₦${addCommas(enrollment.balanceLeft)}` : ""}
            </MobileB1LightGray900>
          </Stack>

          <Box mt="32px" mb="20px">
            <MobileB2MGray900>Payment history</MobileB2MGray900>
          </Box>
          <Stack spacing={"42px"}>
            {invoiceData?.items?.map((x) => {
              return (
                <TransactionCard
                  userData={userData}
                  handleUpdateInvoices={handleUpdateInvoices}
                  handleResolvePayment={handleResolvePayment}
                  key={x?.id}
                  invoice={x}
                />
              );
            })}
          </Stack>
          <Box mt="32px" width={"fit-content"} mx="auto">
            {Boolean(invoiceData?.totalPages && invoiceData.totalPages > 1) && (
              <Pagination
                onChange={(_, newPage) => {
                  setPage(newPage);
                }}
                page={page}
                count={invoiceData?.totalPages || 1}
                variant="outlined"
                color="secondary"
                size="large"
              />
            )}
          </Box>
        </Stack>
      )}
      <ConfirmationDialog
        message="Are you sure you want to resolve this payment?"
        isOpen={Boolean(resolvePaymentId)}
        onClose={() => setResolvePaymentId(null)}
        onConfirm={onResolvePayment}
        loading={resolvingPayment}
      />
    </Box>
  );
}
export { ClientTransactionHistory };

interface TransactionCardProps {
  invoice: IInvoice;
  handleResolvePayment?: (id?: string) => void;
  handleUpdateInvoices?: (invoice?: IInvoice | null) => void;
  userData: User | null;
}

function TransactionCard({ invoice, handleResolvePayment, handleUpdateInvoices, userData }: TransactionCardProps) {
  const [showPdf, setShowPdf] = useState(false);

  const onResolve = () => {
    if (invoice?.previousNotPaid) return;
    handleResolvePayment?.(invoice?.id);
  };

  const getInvoiceStatus = (): {
    severity: Severity;
    label: string;
  } => {
    if (invoice?.status === "OVERDUE") {
      return {
        severity: "danger",
        label: "Overdue",
      };
    }
    if (invoice?.status === "PAID") {
      return {
        severity: "success",
        label: "Paid",
      };
    }

    return {
      severity: "warning",
      label: "Pending",
    };
  };

  function getPaymentDetails() {
    if (!invoice?.updatedAt) return null;
    if (invoice?.status === "PAID") return { type: "Payment date", date: getDateTimeString(invoice?.paymentDate, "date-only") };
    if (invoice?.status === "CANCELLED")
      return { type: "Cancellation date", date: getDateTimeString(invoice?.paymentDate, "date-only") };
    return null;
  }

  const paymentDetails = getPaymentDetails();
  const status = getInvoiceStatus();
  const roleId = userData?.roleId;
  const previousNotPaid = invoice?.previousNotPaid;

  const isCurrentUserEnrollment = invoice?.enrolment?.client?.id === userData?.id;
  const enrollmentActive = invoice.enrolment.status !== "CANCELLED" && invoice.enrolment.status !== "FREEZE";

  const ownerUserCanSeeInvoice = hasPermission(roleId, "download:invoice") && isCurrentUserEnrollment && enrollmentActive;

  const moderatorCanResolveInvoice = hasPermission(roleId, "resolve:invoice") && enrollmentActive && invoice.status === "PENDING";

  const isModerator = getIsModerator(roleId);

  return (
    <Stack>
      <TransactionCardContainer>
        <Stack spacing={"8px"}>
          <Font7001421Gray900>#{invoice?.invoiceNum}</Font7001421Gray900>
          <MobileB1LightGray900>{getDateTimeString(invoice.dueDate, "date-only")}</MobileB1LightGray900>
          {invoice?.status === "OVERDUE" && <MobileB1LightGray900>Overdue amount</MobileB1LightGray900>}
          {paymentDetails && <MobileB1LightGray900>{paymentDetails?.type}</MobileB1LightGray900>}
          {isModerator && Boolean(invoice?.moderatedBy) && <MobileB1LightGray900>Resolved by</MobileB1LightGray900>}
        </Stack>
        <Stack spacing={"8px"}>
          <Box fontWeight={"bold"}>
            <Font7001421Gray900> ₦{addCommas(invoice.amount)}</Font7001421Gray900>
          </Box>
          <StatusPill status={status.severity}>
            <Stack direction={"row"} alignItems={"center"}>
              <Check weight="bold" /> <span>{status.label}</span>
            </Stack>
          </StatusPill>
          {invoice?.status === "OVERDUE" && <MobileB1LightGray900>₦{addCommas(invoice?.overDueAmount)}</MobileB1LightGray900>}
          {paymentDetails && <MobileB1LightGray900>{paymentDetails?.date}</MobileB1LightGray900>}
          {isModerator && Boolean(invoice?.moderatedBy) && (
            <MobileB1LightGray900>{getUserName(invoice?.moderatedBy)}</MobileB1LightGray900>
          )}
        </Stack>
      </TransactionCardContainer>

      {hasPermission(userData?.roleId, "view-commission:invoice") && !isCurrentUserEnrollment && (
        <AgentCommissionContainer mt="8px">
          <MobileCap2MGray600>₦{addCommas(invoice?.agentCommission)} commission</MobileCap2MGray600>
        </AgentCommissionContainer>
      )}

      {(ownerUserCanSeeInvoice || isModerator) && (
        <Box mt="8px">
          <ButtonPill onClick={() => setShowPdf(true)}>
            <Stack direction={"row"} spacing={"5px"} alignItems={"center"}>
              <Receipt size={14} weight="bold" />{" "}
              <MobileCap2MGray900>See {invoice?.status === "PAID" ? "receipt" : "invoice"}</MobileCap2MGray900>
            </Stack>
          </ButtonPill>
        </Box>
      )}

      {moderatorCanResolveInvoice && (
        <Box mt="8px">
          <Tooltip title={previousNotPaid ? "Resolve the previous month" : ""}>
            <ButtonPill onClick={onResolve}>
              <Stack direction={"row"} spacing={"5px"} alignItems={"center"}>
                <CheckSquare size={14} weight="bold" color={previousNotPaid ? COLORS.gray500 : COLORS.blackNormal} />
                {previousNotPaid ? (
                  <MobileCap2MGray500>Resolve payment</MobileCap2MGray500>
                ) : (
                  <MobileCap2MGray900>Resolve payment</MobileCap2MGray900>
                )}
              </Stack>
            </ButtonPill>
          </Tooltip>
        </Box>
      )}
      <InvoiceTemplate makePayment={handleUpdateInvoices} invoice={invoice} isOpen={showPdf} onClose={() => setShowPdf(false)} />
    </Stack>
  );
}
