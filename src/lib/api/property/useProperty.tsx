"use client";
import {
  FetchPropertiesArgs,
  IProperty,
  PropertyFormPayload,
  PropertyMarketPrice,
  UpdatePropertyFormPayload,
} from "./property.types";
import { z } from "zod";
import { ApiResponse, PaginatedResponse } from "../api.types";
import { PropertyFormState } from "@/components/forms/PropertyForm";
import { formatError } from "@/services/errors";
import { formatZodErrors } from "@/services/validation/zod";
import { useCallback } from "react";
import { getClient, postClient, putClient } from "../client.api";
import { uploadFile } from "../file-upload";

function useProperty() {
  const createProperty = async (initialState: PropertyFormState, payload: PropertyFormPayload) => {
    let formState = { ...initialState };

    const schema = z.object({
      propertyName: z.string().nonempty({ message: "This field is required" }),
      stateId: z.string().nonempty({ message: "This field is required" }),
      lgaId: z.string().nonempty({ message: "This field is required" }),
      areaId: z.string().nonempty({ message: "This field is required" }),
      address: z.string().nonempty({ message: "This field is required" }),
      landType: z.string().nonempty({ message: "This field is required" }),
      youtubeUrl: z.string().optional(),
      totalLandSize: z
        .number({ message: "Total land size must be a number" })
        .min(1, { message: "Overdue interest must be greater than 0" }),
      installmentInterest: z
        .number({ message: "Installment interest must be a number" })
        .min(1, { message: "Land Size must be greater than 0" }),
      overDueInterest: z
        .number({ message: "Overdue interest must be a number" })
        .min(1, { message: "Overdue interest must be greater than 0" }),
      installmentPeriod: z
        .number({ message: "Installment period must be a number" })
        .min(1, { message: "Installment period must be greater than 0" }),

      availableLandSizes: z
        .array(z.object({ price: z.number(), size: z.number() }))
        .nonempty({ message: "At least one land size is required" }),
      paymentDurationOptions: z.array(z.number()).optional(),

      propertyPic: z.any().superRefine((file, ctx) => {
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
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<IProperty> | null = null;

      try {
        // upload image to cloudinary
        const data = { ...validation.data };
        const uploadedImageResponse = await uploadFile(data.propertyPic, "property-banner");

        if (uploadedImageResponse) {
          data.propertyPic = uploadedImageResponse?.url;
        }
        response = await postClient<IProperty>("properties", data);

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
        formState = { result: null, error: { requestError: "Something went wrong" } };
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }
    return formState;
  };

  const updateProperty = async (initialState: PropertyFormState, payload: UpdatePropertyFormPayload) => {
    let formState = { ...initialState };

    const schema = z.object({
      propertyName: z.string().nonempty({ message: "This field is required" }),
      status: z.string().nonempty({ message: "This field is required" }),
      totalLandSize: z.number({ message: "Land size must be a number" }).min(1, { message: "Land Size must be greater than 0" }),
      youtubeUrl: z.string().optional(),
      propertyPic: z.any().superRefine((file, ctx) => {
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
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<IProperty> | null = null;

      try {
        // upload image to cloudinary
        const data = { ...validation.data };
        const uploadedImageResponse = await uploadFile(data.propertyPic, "property-banner");

        if (uploadedImageResponse) {
          data.propertyPic = uploadedImageResponse?.url;
        }

        response = await putClient<IProperty>(`properties/${payload.id}`, { ...data });

        if (response?.statusCode === 200 || response?.statusCode === 201) {
          // Show result if request was successful
          if (response?.result) {
            formState = { result: response.result, error: {} };
          } else {
            formState = { result: true, error: {} };
          }
        } else if (response?.statusCode === 413) {
          formState = { result: null, error: { requestError: "File too large! Max file size is 3mb." } };
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
        formState = { result: null, error: { requestError: "Something went wrong" } };
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }
    return formState;
  };

  const fetchProperties = useCallback(async (args?: FetchPropertiesArgs): Promise<PaginatedResponse<IProperty> | null> => {
    try {
      const response = await getClient<PaginatedResponse<IProperty> | null>(
        `properties?page=${args?.page || 1}&limit=${args?.limit || 10}${
          args?.propertyName ? `&propertyName=${args.propertyName}` : ""
        }${args?.stateId ? `&stateId=${args.stateId}` : ""}
${args?.lgaId ? `&lgaId=${args.lgaId}` : ""}
${args?.areaId ? `&areaId=${args.areaId}` : ""}
${args?.status ? `&status=${args.status}` : ""}
${args?.includeDisabled ? `&includeDisabled=${args.includeDisabled}` : ""}`
      );
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(`Unable to fetch properties}\n. ${formatError(error)}`);
      return null;
    }
  }, []);

  const fetchProperty = useCallback(async (id: string): Promise<IProperty | null> => {
    try {
      const response = await getClient<IProperty | null>(`properties/${id}`);
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const addPropertyMarketValue = useCallback(
    async (propertyId: string, propertyValues: PropertyMarketPrice[]): Promise<boolean> => {
      try {
        const response = await putClient<IProperty>(`properties/update-market-value/${propertyId}`, {
          availableLandSizes: propertyValues,
        });
        if (response?.statusCode === 200) {
          return true;
        }
        return false;
      } catch (error) {
        console.error(formatError(error));
        return false;
      }
    },
    []
  );

  return {
    addPropertyMarketValue,
    createProperty,
    fetchProperties,
    updateProperty,
    fetchProperty,
  };
}

export { useProperty };
