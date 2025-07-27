import { AutoCompleteWithSubOptions } from "@/components/Inputs";
import { IProperty } from "../property/property.types";
import { User } from "../user/user.types";
import { Dayjs } from "dayjs";

const ENROLLMENT_STATUSES = ["ONGOING", "CANCELLED", "COMPLETED", "FREEZE"] as const;
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
  interest: number;
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
  migratedTotal: number;
  migratedDuration: number;
  isMigrated: boolean;
}

interface EnrollmentPayload {
  clientId: string;
  agentId?: string;
  createdAt?: string;
  leadType?: string;
  propertyId: string;
  landSize: number;
  price: number;
  installmentInterest: number;
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
  installmentInterest: number;
  installmentDuration: number;
  outrightPayment: boolean;
  createdAt?: string;
}

interface EnrollmentFormPayload {
  clientId?: AutoCompleteWithSubOptions | null;
  agentId?: AutoCompleteWithSubOptions | null;
  leadType?: string;
  propertyId?: AutoCompleteWithSubOptions | null;
  landSize: number | "";
  price: number | "";
  installmentInterest: number | "";
  installmentDuration: number | "";
  outrightPayment: boolean;
  overDueInterest: number | "";
  createdAt?: Dayjs | null;
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
  status?: EnrollmentStatus;
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
