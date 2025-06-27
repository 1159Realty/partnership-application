"use client";

import { z } from "zod";
import { FetchAppointmentArgs, IAppointment, ScheduleAppointmentPayload } from "./appointment.types";
import { ApiResponse, PaginatedResponse } from "../api.types";
import { getClient, postClient, putClient } from "../client.api";
import { formatError } from "@/services/errors";
import { formatZodErrors } from "@/services/validation/zod";
import { useCallback } from "react";
import { ScheduleAppointmentFormState } from "@/components/forms/ScheduleAppointmentForm";
import { getClientSession } from "@/lib/session/client";

function useAppointment() {
  async function createAppointment(initialState: ScheduleAppointmentFormState, payload: ScheduleAppointmentPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      weekday: z.string().nonempty({ message: "This field is required" }),
      period: z.number({ message: "Invalid period" }).min(1, { message: "Invalid period" }),
      propertyId: z.string().optional(),
      time: z.string().optional(),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<IAppointment> | null = null;

      try {
        response = await postClient<IAppointment>("appointments", validation.data);
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
        formState = { result: null, error: { requestError: response?.message || "Something went wrong" } };
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }
    return formState;
  }

  const fetchAppointments = useCallback(async (args?: FetchAppointmentArgs): Promise<PaginatedResponse<IAppointment> | null> => {
    try {
      const response = await getClient<PaginatedResponse<IAppointment> | null>(
        `appointments?page=${args?.page || 1}&limit=${args?.limit || 10}${args?.keyword ? `&keyword=${args.keyword}` : ""}${
          args?.status ? `&status=${args.status}` : ""
        }${args?.propertyId ? `&propertyId=${args.propertyId}` : ""}
${args?.userId ? `&userId=${args.userId}` : ""}
${args?.stateId ? `&stateId=${args.stateId}` : ""}
${args?.lgaId ? `&lgaId=${args.lgaId}` : ""}
${args?.areaId ? `&areaId=${args.areaId}` : ""}`
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

  const fetchAppointmentsByUserId = useCallback(
    async (args?: FetchAppointmentArgs): Promise<PaginatedResponse<IAppointment> | null> => {
      const session = getClientSession();
      try {
        const response = await getClient<PaginatedResponse<IAppointment> | null>(
          `appointments?userId=${session?.user?.id}&page=${args?.page || 1}&limit=${args?.limit || 10}${
            args?.status ? `&status=${args.status}` : ""
          }${args?.propertyId ? `&propertyId=${args.propertyId}` : ""}`
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

  async function cancelAppointment(id: string, message: string): Promise<boolean> {
    try {
      const response = await putClient(`appointments/cancel/${id}`, { message });
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }

  async function completeAppointment(id: string): Promise<boolean> {
    try {
      const response = await getClient(`appointments/complete/${id}`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }

  return { createAppointment, fetchAppointments, completeAppointment, cancelAppointment, fetchAppointmentsByUserId };
}

export { useAppointment };
