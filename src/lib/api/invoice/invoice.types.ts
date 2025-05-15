import { IEnrollment } from "../enrollment/types";
import { User } from "../user/user.types";

const invoiceStatusArr = ["PAID", "PENDING", "OVERDUE", "CANCELLED"] as const;
type InvoiceStatus = (typeof invoiceStatusArr)[number];

interface IInvoice {
  status: InvoiceStatus;
  dueDate: string;
  paymentDate: string;
  createdAt: string;
  amount: number;
  agentCommission: number;
  enrolment: IEnrollment;
  id: string;
  invoiceNum: number;
  moderatedBy: User;
  overDueAmount: number;
  interestAmount: number;
  totalAmount: number;
  updatedAt: string;
  previousNotPaid: boolean;
  type: string;
}

interface FetchInvoiceArgs {
  page?: number;
  limit?: number;
  enrollmentId?: string;
  userId?: string;
  status?: InvoiceStatus;
  startDate?: string;
  endDate?: string;
}

interface IMakePaymentCredentials {
  access_code: string;
  authorization_url: string;
  invoiceId: string;
  reference: string;
}

interface InvoiceTotal {
  totalInvoiceAmount: number;
  totalPlatformInvoiceAmount: number;
  totalInvoices: number;
  totalPlatformInvoices: number;
  totalPendingAmount: number;
  totalPlatformPendingAmount: number;
  totalOverdueAmount: number;
  totalPlatformOverdueAmount: number;
  totalPaidAmount: number;
  totalPlatformPaidAmount: number;
}

interface InvoiceReportTotal {
  totalInvoiceAmount: number;
  totalPendingAmount: number;
  totalPaidAmount: number;
}

export type { IInvoice, InvoiceStatus, FetchInvoiceArgs, IMakePaymentCredentials, InvoiceTotal, InvoiceReportTotal };
export { invoiceStatusArr };
