import { User } from "../user/user.types";
import { IProperty } from "../property/property.types";
import { FileType } from "../file-upload/file-upload.types";
import { AutoCompleteWithSubOptions } from "@/components/Inputs";

const documentStatusArray = ["COMPLETED", "PENDING", "REJECTED"] as const;
type DocumentStatus = (typeof documentStatusArray)[number];

type DocumentPayload = {
  name: string;
  link: string;
  type: string;
  documentGroupId: string;
  message?: string;
  status?: string;
};

type DocumentFormPayload = {
  name?: string;
  document?: string | FileType;
  documentGroupId?: string;
  type?: "MODERATOR" | "CLIENT";
  status?: DocumentStatus;
  message?: string;
  documentId?: string;
};

type DocumentGroupPayload = {
  title: string;
  description: string;
  propertyId?: string;
  clientId?: string;
  documentGroupId?: string;
  videoUrl?: string;
};

type DocumentGroupFormPayload = {
  title: string;
  description: string;
  propertyId?: AutoCompleteWithSubOptions;
  clientId?: AutoCompleteWithSubOptions;
  documentGroupId?: string;
  videoUrl?: string;
};

type IDocument = {
  groupId: string;
  id: string;
  name: string;
  link: string;
  status: DocumentStatus;
  type: "MODERATOR" | "CLIENT";
  message: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
};

type IDocumentGroup = {
  id: string;
  title: string;
  description: string;
  client: User;
  property: IProperty;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
  videoUrl: string;
};

interface FetchDocumentGroupArgs {
  keyword?: string;
  userId?: string;
  propertyId?: string;
  page?: number;
  limit?: number;
}
interface FetchDocumentArgs {
  keyword?: string;
  userId?: string;
  documentGroupId?: string;
  type?: "MODERATOR" | "CLIENT";
  status?: DocumentStatus;
  page?: number;
  limit?: number;
}

export type {
  DocumentPayload,
  DocumentFormPayload,
  IDocument,
  FetchDocumentGroupArgs,
  DocumentStatus,
  IDocumentGroup,
  FetchDocumentArgs,
  DocumentGroupPayload,
  DocumentGroupFormPayload,
};
export { documentStatusArray };
