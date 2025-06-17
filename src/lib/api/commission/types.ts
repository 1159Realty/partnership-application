import { IInvoice } from "../invoice/invoice.types";
import { User } from "../user/user.types";

const commissionStatusArr = ["PAID", "PENDING", "CANCELLED"] as const;
type CommissionStatus = (typeof commissionStatusArr)[number];

const AGENT_PERFORMANCE_TOTAL_TYPES = [
  "CLIENTS_TOTAL",
  "TOTAL_REVENUE_AMOUNT",
  "PENDING_REVENUE_AMOUNT",
  "RECEIVED_REVENUE_AMOUNT",
  "TOTAL_COMMISSION_AMOUNT",
  "PENDING_COMMISSION_AMOUNT",
  "RECEIVED_COMMISSION_AMOUNT",
];
type AgentPerformanceTotalType = (typeof AGENT_PERFORMANCE_TOTAL_TYPES)[number];

interface ICommission {
  commissionNum: number;
  id: string;
  status: CommissionStatus;
  releaseDate: string;
  invoice: IInvoice;
  amount: number;
  createdAt: string;
  updatedAt: string;
  agent: User;
}

interface FetchCommissionsArgs {
  page?: number;
  limit?: number;
  enrollmentId?: string;
  agentId?: string;
  status?: CommissionStatus;
}

interface ICommissionTotal {
  totalCommissionItems: number;
  totalPaidAmount: number;
  totalPendingAmount: number;
  totalCommissionAmount: number;
}

interface FetchAgentPerformanceReportArgs {
  page?: number;
  limit?: number;
  month?: string;
  year?: string;
  keyword?: string;
  totalType?: AgentPerformanceTotalType;
}

interface IAgentPerformanceReport {
  id: string;
  agent: User;
  clientsTotal: number;
  totalRevenueAmount: number;
  pendingRevenueAmount: number;
  receivedRevenueAmount: number;
  totalCommissionAmount: number;
  pendingCommissionAmount: number;
  receivedCommissionAmount: number;
}

export type {
  ICommission,
  CommissionStatus,
  FetchCommissionsArgs,
  ICommissionTotal,
  IAgentPerformanceReport,
  FetchAgentPerformanceReportArgs,
  AgentPerformanceTotalType,
};
export { commissionStatusArr, AGENT_PERFORMANCE_TOTAL_TYPES };
