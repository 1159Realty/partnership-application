import { AutoCompleteWithSubOptions } from "@/components/Inputs";
import { User } from "../user/user.types";

const supportTypesArray = ["PAYMENT", "PROPERTY", "AGENT"] as const;
type SupportType = (typeof supportTypesArray)[number];

const supportStatusArray = [
  "IN_PROGRESS",
  //  "PENDING",
  "RESOLVED",
] as const;
type SupportStatus = (typeof supportStatusArray)[number];

interface ISupport {
  id: string;
  message: string;
  status: SupportStatus;
  supportCategory: ISupportCategory;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  resolvedBy: User;
  ticketNum: number;
}

interface FetchSupportArgs {
  page?: number;
  limit?: number;
  supportCategoryId?: string;
  status?: SupportStatus;
  userId?: string;
}

type SupportFormPayload = {
  supportCategoryId?: AutoCompleteWithSubOptions;
  message?: string;
  supportId?: string;
};

type SupportPayload = {
  supportCategoryId?: string;
  message?: string;
  supportId?: string;
};

//support category
interface ISupportCategory {
  id: string;
  name: string;
}
interface SupportCategoryPayload {
  name: string;
}

export type {
  SupportType,
  SupportStatus,
  ISupport,
  FetchSupportArgs,
  ISupportCategory,
  SupportCategoryPayload,
  SupportFormPayload,
  SupportPayload,
};
export { supportTypesArray, supportStatusArray };
