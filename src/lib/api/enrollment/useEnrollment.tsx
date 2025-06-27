"use client";

import { ApiResponse, PaginatedResponse } from "../api.types";
import { getClient, postClient, putClient } from "../client.api";
import { formatError } from "@/services/errors";
import { EnrollmentPayload, EnrollmentValidationPayload, FetchEnrollmentArgs, IEnrollment } from "./types";
import { useCallback } from "react";
import { getClientSession } from "@/lib/session/client";
import { EnrollmentFormState } from "@/components/forms/EnrollClientForm";
import { z } from "zod";
import { formatZodErrors } from "@/services/validation/zod";

function useEnrollment() {
  const fetchEnrollments = useCallback(async (args?: FetchEnrollmentArgs): Promise<PaginatedResponse<IEnrollment> | null> => {
    try {
      const response = await getClient<PaginatedResponse<IEnrollment> | null>(
        `enrolments?page=${args?.page || 1}&limit=${args?.limit || 10}${args?.keyword ? `&keyword=${args.keyword}` : ""}${
          args?.userId ? `&userId=${args.userId}` : ""
        }${args?.propertyId ? `&propertyId=${args.propertyId}` : ""}${args?.agentId ? `&agentId=${args.agentId}` : ""}${
          args?.stateId ? `&stateId=${args.stateId}` : ""
        }${args?.lgaId ? `&lgaId=${args.lgaId}` : ""}${args?.areaId ? `&areaId=${args.areaId}` : ""}`
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

  const fetchEnrollmentsByUserId = useCallback(
    async ({
      stateId,
      lgaId,
      page = 1,
      limit = 10,
      areaId,
    }: FetchEnrollmentArgs): Promise<PaginatedResponse<IEnrollment> | null> => {
      try {
        const session = getClientSession();
        const response = await getClient<PaginatedResponse<IEnrollment> | null>(
          `enrollment?page=${page}&limit=${limit}&userId=${session?.user?.id}${stateId ? `&stateId=${stateId}` : ""}${
            lgaId ? `&lgaId=${lgaId}` : ""
          }${areaId ? `&areaId=${areaId}` : ""}`
        );
        if (response?.statusCode === 200) {
          return response?.result;
        }
        return null;
      } catch (error) {
        console.error(`Unable to fetch properties}\n. ${formatError(error)}`);
        return null;
      }
    },
    []
  );

  async function createEnrollment(initialState: EnrollmentFormState, payload: EnrollmentValidationPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      clientId: z.string().nonempty({ message: "This field is required" }),
      propertyId: z.string().nonempty({ message: "This field is required" }),
      price: z.number({ message: "Price is a number" }).min(1, { message: "Enter a valid number" }),
      landSize: z.number({ message: "Land size is a number" }).min(1, { message: "Enter a valid number" }),
      installmentDuration: z.number({ message: "Duration is a number" }).min(1, { message: "Enter a valid number" }),
      outrightPayment: z.boolean(),
      agentId: z.string().optional(),
      leadType: z.string().optional(),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<IEnrollment> | null = null;

      try {
        const data: EnrollmentPayload = {
          clientId: validation.data?.clientId,
          agentId: validation.data?.agentId,
          propertyId: validation.data?.propertyId,
          price: validation?.data?.price,
          landSize: validation?.data?.landSize,
          installmentDuration: validation?.data?.installmentDuration,
          outrightPayment: validation?.data?.outrightPayment,
          leadType: validation?.data?.leadType,
        };

        response = await postClient<IEnrollment>("enrolments", data);
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
          console.error(`Request error: ${response.message}`);
        }
      }
      if (response?.statusCode !== 200 && response?.statusCode !== 201) {
        // Show error if request was not successful
        if (response?.statusCode === 430) {
          formState = { result: null, error: { requestError: "Insufficient land size" } };
        } else {
          formState = { result: null, error: { requestError: response?.message || "Something went wrong" } };
        }
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }
    return formState;
  }

  const cancelEnrollment = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await postClient(`revocation/${id}`);
      if (response?.statusCode === 201) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  const resumeEnrollment = useCallback(async (id: string): Promise<"success" | "insufficient-land" | null> => {
    try {
      // TODO handle no land size scenario
      const response = await putClient(`enrolments/resume/${id}`);
      if (response?.statusCode === 200) {
        return "success";
      } else if (response?.statusCode === 403 || response?.statusCode === 430) {
        return "insufficient-land";
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const addPlotId = useCallback(async (enrollmentId: string, plotId: string): Promise<boolean> => {
    try {
      const response = await putClient(`enrolments/update-plot/${enrollmentId}`, { plotId });
      if (response?.statusCode === 200) {
        return true;
      } else if (response?.statusCode === 403 || response?.statusCode === 430) {
        return false;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  return {
    fetchEnrollmentsByUserId,
    fetchEnrollments,
    createEnrollment,
    cancelEnrollment,
    resumeEnrollment,
    addPlotId,
  };
}

export { useEnrollment };
