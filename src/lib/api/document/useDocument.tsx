"use client";

import { z } from "zod";
import { ApiResponse, PaginatedResponse } from "../api.types";
import { getClient, postClient, putClient, removeClient } from "../client.api";
import { formatError } from "@/services/errors";
import { formatZodErrors } from "@/services/validation/zod";
import { useCallback } from "react";
import { DocumentFormState } from "@/components/forms/DocumentForm";
import { uploadFile } from "../file-upload";
import {
  DocumentFormPayload,
  DocumentGroupPayload,
  DocumentPayload,
  FetchDocumentArgs,
  FetchDocumentGroupArgs,
  IDocument,
  IDocumentGroup,
} from "./document.types";
import { DocumentGroupFormState } from "@/components/forms/DocumentGroupForm";

function useDocument() {
  async function createDocumentGroup(initialState: DocumentGroupFormState, payload: DocumentGroupPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      title: z.string().nonempty({ message: "This field is required" }),
      description: z.string().nonempty({ message: "This field is required" }),
      clientId: z.string().optional(),
      propertyId: z.string().optional(),
      youtubeUrl: z.string().optional(),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<IDocumentGroup> | null = null;

      let data = {
        ...validation.data,
      };

      if (payload?.documentGroupId) {
        data = {
          title: data?.title,
          description: data?.description,
          youtubeUrl: data?.youtubeUrl,
        };
      }

      try {
        if (payload?.documentGroupId) {
          response = await putClient<IDocumentGroup>(`documents/document-group/${payload.documentGroupId}`, data);
        } else {
          response = await postClient<IDocumentGroup>("documents/document-group", data);
        }
        if (response?.statusCode === 200 || response?.statusCode === 201) {
          // Show result if request was successful
          if (response?.result) {
            formState = { result: response.result, error: {} };
          } else {
            formState = { result: true, error: {} };
          }
        }
      } catch (error) {
        // Log error to console
        console.error(formatError(error));
        if (response?.message) {
          console.error(response.message);
        }
      }
      if (response?.statusCode !== 200 && response?.statusCode !== 201) {
        // Show error if request was not successful
        formState = { result: null, error: { requestError: "Something went wrong" } };
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }
    return formState;
  }
  async function createDocument(initialState: DocumentFormState, payload: DocumentFormPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      name: z.string().nonempty({ message: "This field is required" }),
      document: payload?.documentId
        ? z.any()?.optional()
        : z.any().superRefine((file, ctx) => {
            if (!file?.size) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "This field is required",
              });
              return;
            }

            if (!(file instanceof File)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid file format",
              });
              return;
            }
          }),
      type: z.string().optional(),
      documentGroupId: z.string().optional(),
      propertyId: z.string().optional(),
      status: z.string().optional(),
      message: z.string().optional().nullable(),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<IDocument> | null = null;

      try {
        // upload image to cloudinary
        const data = { ...validation.data };
        let uploadResponse;
        if (data?.document) {
          uploadResponse = await uploadFile(data?.document, "document");
        }

        const payloadData: DocumentPayload = {
          name: data?.name,
          link: uploadResponse?.url || "",
          type: data?.type || "",
          documentGroupId: data?.documentGroupId || "",
          message: data?.message || undefined,
          status: data?.status,
        };
        if (payload?.documentId) {
          response = await putClient<IDocument>(`documents/document/${payload.documentId}`, payloadData);
        } else {
          response = await postClient<IDocument>("documents/document", payloadData);
        }

        if (response?.statusCode === 200 || response?.statusCode === 201) {
          // Show result if request was successful
          if (response?.result) {
            formState = { result: response.result, error: {} };
          } else {
            formState = { result: true, error: {} };
          }
        }
      } catch (error) {
        // Log error to console
        console.error(formatError(error));
        if (response?.message) {
          console.error(response.message);
        }
      }
      if (response?.statusCode !== 200 && response?.statusCode !== 201) {
        // Show error if request was not successful
        formState = { result: null, error: { requestError: "Something went wrong" } };
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }
    return formState;
  }

  const fetchDocumentGroups = useCallback(
    async (args?: FetchDocumentGroupArgs): Promise<PaginatedResponse<IDocumentGroup> | null> => {
      try {
        const response = await getClient<PaginatedResponse<IDocumentGroup> | null>(
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
    },
    []
  );

  const fetchDocuments = useCallback(async (args?: FetchDocumentArgs): Promise<PaginatedResponse<IDocument> | null> => {
    try {
      const response = await getClient<PaginatedResponse<IDocument> | null>(
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
  }, []);

  async function deleteDocument(id: string): Promise<boolean> {
    try {
      const response = await removeClient(`documents/document/${id}`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }

  return {
    createDocument,
    fetchDocuments,
    deleteDocument,
    fetchDocumentGroups,
    createDocumentGroup,
  };
}

export { useDocument };
