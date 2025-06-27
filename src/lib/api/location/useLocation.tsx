import { formatError } from "@/services/errors";
import { IArea, FetchAllAreasArgs, ILga, IState, AreaPayload } from "./location.types";
import { useCallback } from "react";
import { getClient, postClient, putClient } from "../client.api";
import { ApiResponse, PaginatedResponse } from "../api.types";
import { AreaFormState } from "@/components/forms/LocationForm";
import { z } from "zod";
import { formatZodErrors } from "@/services/validation/zod";

function useLocation() {
  const fetchStates = useCallback(async (): Promise<IState[] | null> => {
    try {
      const response = await getClient<PaginatedResponse<IState>>(`state-and-lgas/states`);
      if (response?.result?.items?.length) {
        return response.result.items;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const fetchLgas = useCallback(async (stateId: string): Promise<ILga[] | null> => {
    try {
      const response = await getClient<PaginatedResponse<ILga>>(`state-and-lgas/lgas/${stateId}`);
      if (response?.result?.items?.length) {
        return response.result.items;
      }
      return null;
    } catch (error) {
      console.error(`Unable to fetch lga for state with  id=${stateId}\n. ${formatError(error)}`);
      return null;
    }
  }, []);

  const fetchAreas = useCallback(async (args?: FetchAllAreasArgs): Promise<PaginatedResponse<IArea> | null> => {
    try {
      const response = await getClient<PaginatedResponse<IArea>>(
        `state-and-lgas/areas?page=${args?.page || 1}&limit=${args?.limit || 10}${
          args?.keyword?.trim() ? `&keyword=${args.keyword}` : ""
        }${args?.stateId?.trim() ? `&stateId=${args.stateId}` : ""}${args?.lgaId?.trim() ? `&lgaId=${args.lgaId}` : ""}`
      );
      if (response?.result?.items?.length) {
        return response.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  async function addArea(initialState: AreaFormState, payload: AreaPayload, updateId?: string) {
    let formState = { ...initialState };

    const schema = z.object({
      stateId: z.string().nonempty({ message: "This field is required" }),
      lgaId: z.string().nonempty({ message: "This field is required" }),
      area: z.string().nonempty({ message: "This field is required" }),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<IArea> | null = null;

      try {
        if (updateId) {
          response = await putClient<IArea>(`state-and-lgas/areas/${updateId}`, validation.data);
        } else {
          response = await postClient<IArea>(`state-and-lgas/areas`, validation.data);
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
        formState = { result: null, error: { requestError: response?.message || "Something went wrong" } };
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }
    return formState;
  }

  return {
    fetchLgas,
    fetchAreas,
    fetchStates,
    addArea,
  };
}

export { useLocation };
