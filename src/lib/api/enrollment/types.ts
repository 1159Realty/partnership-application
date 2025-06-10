import { AutoCompleteWithSubOptions } from "@/components/Inputs";
import { IProperty } from "../property/property.types";
import { User } from "../user/user.types";

const ENROLLMENT_STATUSES = ["PENDING", "ONGOING", "CANCELLED", "COMPLETED", "FREEZE"] as const;
type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

const leadTypes = ["COMPANY", "PRIVATE"] as const;
type LeadType = (typeof leadTypes)[number];

interface IEnrollment {
  id: string;
  property: IProperty;
  client: User;
  agent: User;
  landSize: number;
  price: number;
  installmentDuration: number;
  outrightPayment: boolean;
  status: EnrollmentStatus;
  totalAmount: number;
  balanceLeft: number;
  createdAt: string;
  updatedAt: string;
  moderatedBy: User;
  createdBy: User;
  plotId: string;
}

interface EnrollmentPayload {
  clientId: string;
  agentId?: string;
  leadType?: string;
  propertyId: string;
  landSize: number;
  price: number;
  installmentDuration: number;
  outrightPayment: boolean;
}

interface EnrollmentValidationPayload {
  clientId?: string;
  agentId?: string;
  propertyId?: string;
  leadType?: string;
  landSize: number;
  price: number;
  installmentDuration: number;
  outrightPayment: boolean;
}

interface EnrollmentFormPayload {
  clientId?: AutoCompleteWithSubOptions | null;
  agentId?: string;
  leadType?: string;
  propertyId?: AutoCompleteWithSubOptions | null;
  landSize: number | "";
  price: number | "";
  installmentDuration: number | "";
  outrightPayment: boolean;
  installmentInterest: number | "";
  overDueInterest: number | "";
}

interface FetchEnrollmentArgs {
  keyword?: string;
  userId?: string;
  propertyId?: string;
  agentId?: string;
  stateId?: string;
  lgaId?: string;
  areaId?: string;
  page?: number;
  limit?: number;
}

interface EnrollmentsReportTotal {
  totalEnrollments: number;
  totalCompleted: number;
  totalCancelled: number;
}

export type {
  IEnrollment,
  LeadType,
  EnrollmentPayload,
  EnrollmentFormPayload,
  FetchEnrollmentArgs,
  EnrollmentValidationPayload,
  EnrollmentsReportTotal,
  EnrollmentStatus,
};
export { leadTypes, ENROLLMENT_STATUSES };
