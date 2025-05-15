import { formatError } from "@/services/errors";
import { PaginatedResponse } from "../api.types";
import { getServer } from "../sever.api";
import { FetchDocumentArgs, FetchDocumentGroupArgs, IDocument, IDocumentGroup } from "./document.types";

async function fetchDocumentGroups(args?: FetchDocumentGroupArgs): Promise<PaginatedResponse<IDocumentGroup> | null> {
  try {
    const response = await getServer<PaginatedResponse<IDocumentGroup> | null>(
      `documents/document-group?page=${args?.page || 1}&limit=${args?.limit || 10}${
        args?.propertyId?.trim() ? `&propertyId=${args?.propertyId}` : ""
      }${args?.userId?.trim() ? `&userId=${args?.userId}` : ""}${args?.keyword?.trim() ? `&keyword=${args?.keyword}` : ""}`
    );

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchDocumentGroup(id: string): Promise<IDocumentGroup | null> {
  try {
    const response = await getServer<IDocumentGroup | null>(`documents/document-group/${id}`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchDocuments(args?: FetchDocumentArgs): Promise<PaginatedResponse<IDocument> | null> {
  try {
    const response = await getServer<PaginatedResponse<IDocument> | null>(
      `documents/document?page=${args?.page || 1}&limit=${args?.limit || 10}${
        args?.documentGroupId?.trim() ? `&documentGroupId=${args.documentGroupId}` : ""
      }${args?.keyword?.trim() ? `&keyword=${args.keyword}` : ""}${args?.userId?.trim() ? `&userId=${args.userId}` : ""}${
        args?.status?.trim() ? `&status=${args.status}` : ""
      }${args?.type?.trim() ? `&type=${args.type}` : ""}`
    );

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchDocumentGroups, fetchDocuments, fetchDocumentGroup };
