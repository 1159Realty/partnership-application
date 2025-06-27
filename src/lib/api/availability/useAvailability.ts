"use client";

import { z } from "zod";
import { AvailabilityFormState } from "@/components/forms/AvailabilityForm";
import { AvailabilityFormPayload, AvailabilityPayload, IAvailability } from "./availability.types";
import { ApiResponse, PaginatedResponse } from "../api.types";
import { getClient, postClient, removeClient } from "../client.api";
import { formatError } from "@/services/errors";
import { formatZodErrors } from "@/services/validation/zod";
import { Dayjs } from "dayjs";
import { generateMinuteIntervals, getMinuteOfDay } from "@/services/dateTime";
import { useCallback } from "react";

function useAvailability() {
  async function createAvailability(initialState: AvailabilityFormState, payload: AvailabilityFormPayload) {
    let formState = { ...initialState };

    const schema = z
      .object({
        weekday: z.string().nonempty({ message: "This field is required" }),
        resumption: z.any().superRefine((resumption: Dayjs, ctx) => {
          if (!resumption) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "This field is required",
            });
            return;
          }
        }),
        closing: z.any().superRefine((closing: Dayjs, ctx) => {
          if (!closing) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "This field is required",
            });
            return;
          }
        }),
        duration: z
          .number({ message: "Duration must be a number" })
          .min(1, { message: "Duration must be at least 1 minute" })
          .max(60, { message: "Duration cannot be greater than 60 minutes" }),
        slot: z.number({ message: "Duration must be a number" }).min(1, { message: "Slot must be greater than 0" }),
      })
      .refine((data) => data.closing.isAfter(data?.resumption), {
        message: "Closing time must be greater than resumption time",
        path: ["closing"],
      });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<IAvailability> | null = null;
      const data = validation.data;
      const resumption = getMinuteOfDay(data?.resumption);
      const closing = getMinuteOfDay(data?.closing);
      const periods = generateMinuteIntervals(resumption, closing, data?.duration);

      const payload: AvailabilityPayload = {
        weekday: data.weekday,
        periods,
        slot: data.slot,
        duration: data.duration,
      };

      try {
        // TODO: uncomment

        response = await postClient<IAvailability>("availabilities", payload);
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
        formState = { result: null, error: { requestError: response?.message || "Something went wrong" } };
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }
    return formState;
  }

  const fetchAvailabilities = useCallback(async (): Promise<IAvailability[] | null> => {
    try {
      const response = await getClient<PaginatedResponse<IAvailability> | null>(`availabilities`);
      if (response?.statusCode === 200) {
        if (response?.result) {
          return response?.result?.items;
        }
        return null;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  async function deleteAvailability(id: string): Promise<boolean> {
    try {
      const response = await removeClient(`availabilities/${id}`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }

  return { createAvailability, fetchAvailabilities, deleteAvailability };
}

export { useAvailability };
