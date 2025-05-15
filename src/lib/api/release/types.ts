import { ICommission } from "../commission/types";
import { User } from "../user/user.types";

const releaseTypeArray = ["COMMISSION", "REVOCATION"] as const;
type ReleaseType = (typeof releaseTypeArray)[number];

const releaseArray = ["PAID", "PENDING"] as const;
type ReleaseStatus = (typeof releaseArray)[number];

const releaseConfigTypeArray = ["ALL_EXCEPT", "ONLY_FOR", "MANUAL"] as const;
type ReleaseConfigType = (typeof releaseConfigTypeArray)[number];

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
  revocation: unknown;
  // TODO: Add the correct type for revocation
}

interface FetchReleasesArgs {
  page?: number;
  limit?: number;
  userId?: string;
  status?: ReleaseStatus;
}

interface FetchReleaseRecipientArgs {
  page?: number;
  limit?: number;
  keyword?: string;
}

interface IReleaseRecipient {
  id: string;
  release: IRelease;
  recipient: User;
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
};
export { releaseArray, releaseConfigTypeArray, releaseTypeArray };
