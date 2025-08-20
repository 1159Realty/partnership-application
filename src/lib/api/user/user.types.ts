import { AutoCompleteWithSubOptions } from "@/components/Inputs";
import { FileType } from "../file-upload/file-upload.types";
import { IState } from "../location/location.types";
import { Role } from "@/lib/session/roles";

const agentTypes = ["COMPANY", "PRIVATE"] as const;
type AgentType = (typeof agentTypes)[number];

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: Role;
  profilePic: string;
  country: Country;
  state: IState;
  residentialAddress: string;
  gender: Gender;
  trafficSource: InvitationSource;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  roleAssignedBy: User;
  agentType: AgentType;
  bankAccountNumber: string;
  bankCode: string;
  bankName: string;
  requestPartnership: boolean;
  myReferralId: string;
  accountStatus?: _AccountStatus;
  publicId?: string;
  isQualified?: boolean;
}

type UserFormPayload = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePic?: FileType | string;
  country?: string;
  stateId?: string;
  residentialAddress?: string;
  gender?: Gender | "";
  trafficSource?: InvitationSource | "";
  referralId?: string;
};

type UserPayload = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePic?: string;
  country?: string;
  stateId?: string;
  residentialAddress?: string;
  gender?: string;
  trafficSource?: string;
  referralId?: string;
};

const INVITATIONSOURCES = [
  "SOCIAL_MEDIA",
  "YOUTUBE",
  "BILLBOARD",
  "REFERRAL",
] as const;
type InvitationSource = (typeof INVITATIONSOURCES)[number];

const GENDERS = ["MALE", "FEMALE", "RATHER_NOT_SAY"] as const;
type Gender = (typeof GENDERS)[number];

const COUNTRIES = ["NIGERIA", "OTHERS"] as const;
type Country = (typeof COUNTRIES)[number];

const _ACCOUNT_STATUS = ["ACTIVE", "INACTIVE"] as const;
type _AccountStatus = (typeof _ACCOUNT_STATUS)[number];

type FetchUsersArg = {
  page?: number;
  limit?: number;
  keyword?: string;
  roleId?: Role;
  referralId?: string;
  byClientOnly?: boolean;
  byModerators?: boolean;
  sort?: "RECENT";
};

interface UserRoleFormPayload {
  userId: AutoCompleteWithSubOptions | null;
  roleId: string;
  agentType?: AgentType;
}

interface UserRolePayload {
  userId: string;
  roleId: string;
  agentType?: AgentType;
}

interface AssignRolePayload {
  roleId: string;
  agentType?: AgentType;
}

interface BankDetailFormPayload {
  bankAccountNumber: string;
  bank: AutoCompleteWithSubOptions;
}
interface BankDetailPayload {
  bankAccountNumber: string;
  bankCode: string;
  bankName: string;
}
interface IVerifyBankDetail {
  account_number: string;
  account_name: string;
}

interface ClientReportTotal {
  allClientsTotal: number;
}
interface GenderReport {
  male: number;
  female: number;
  others: number;
}
interface TrafficReport {
  source: string;
  total: number;
}

export { INVITATIONSOURCES, GENDERS, agentTypes, COUNTRIES };

export type {
  User,
  UserFormPayload,
  UserPayload,
  FetchUsersArg,
  InvitationSource,
  Gender,
  UserRolePayload,
  UserRoleFormPayload,
  AgentType,
  AssignRolePayload,
  BankDetailFormPayload,
  BankDetailPayload,
  IVerifyBankDetail,
  ClientReportTotal,
  GenderReport,
  TrafficReport,
  Country,
};
