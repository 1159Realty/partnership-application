import { ICommission } from "../commission/types";
import { IEnrollment } from "../enrollment/types";
import { User } from "../user/user.types";

const releaseTypeArray = ["COMMISSION", "REVOCATION"] as const;
type ReleaseType = (typeof releaseTypeArray)[number];

const releaseArray = ["PAID", "PENDING", "SUBMITTED"] as const;
type ReleaseStatus = (typeof releaseArray)[number];

const releaseConfigTypeArray = ["ALL_EXCEPT", "ONLY_FOR", "MANUAL"] as const;
type ReleaseConfigType = (typeof releaseConfigTypeArray)[number];

interface IRevocation {
  id: string;
  amount: number;
  enrolment: IEnrollment;
  client: User;
  moderatedBy: User;
  createdAt: string;
  updatedAt: string;
}

interface IRelease {
  id: string;
  amount: number;
  status: ReleaseStatus;
  type: ReleaseType;
  moderatedBy: User;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  recipient: User;
  commission: ICommission;
  revocation: IRevocation;
}

interface FetchReleasesArgs {
  page?: number;
  limit?: number;
  revocationRecipientId?: string;
  commissionRecipientId?: string;
  revocationEnrolmentId?: string;
  commissionEnrolmentId?: string;
  status?: ReleaseStatus;
  type?: ReleaseType;
}

interface FetchReleaseRecipientArgs {
  page?: number;
  limit?: number;
  keyword?: string;
}

interface IReleaseRecipient {
  allowAutoPayout: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  release: IRelease;
  moderatedBy: User;
  user: User;
  // TODO: Add the correct type for revocation
}

export type {
  IRelease,
  ReleaseStatus,
  FetchReleasesArgs,
  ReleaseConfigType,
  ReleaseType,
  FetchReleaseRecipientArgs,
  IReleaseRecipient,
  IRevocation,
};
export { releaseArray, releaseConfigTypeArray, releaseTypeArray };
