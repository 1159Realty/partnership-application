import { formatError } from "@/services/errors";
import { ApiResponse } from "../api.types";
import { z } from "zod";
import { formatZodErrors } from "@/services/validation/zod";
import { postClient, putClient } from "../client.api";
import { ChangePasswordFormState } from "@/components/forms/UpdateProfileForm";
import { ChangePasswordPayload, PasswordResetPayload } from "./auth.types";
import { useCallback } from "react";
import { ResetPasswordFormState } from "@/modules/forgotPassword/ResetForm";

function useAuth() {
  async function changePassword(initialState: ChangePasswordFormState, payload: ChangePasswordPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      oldPassword: z.string().nonempty({ message: "This field is required" }),
      newPassword: z.string().nonempty({ message: "This field is required" }),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<boolean> | null = null;

      try {
        response = await putClient<boolean>(`auth/change-password`, validation.data);

        // Show result if request was successful
        if (response?.statusCode === 200 || response?.statusCode === 201) {
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
        if (response?.error) {
          formState = { result: null, error: { requestError: response?.message || "Something went wrong" } };
        } else {
          formState = { result: null, error: { requestError: "Something went wrong" } };
        }
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }

    return formState;
  }

  async function resetPassword(initialState: ResetPasswordFormState, payload: PasswordResetPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      newPassword: z.string().nonempty({ message: "This field is required" }),
      userId: z.string().optional(),
      code: z.string().optional(),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<boolean> | null = null;

      try {
        response = await putClient<boolean>(`auth/reset-password`, validation.data);

        // Show result if request was successful
        if (response?.statusCode === 200 || response?.statusCode === 201) {
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
        if (response?.error) {
          formState = { result: null, error: { requestError: response?.message || "Something went wrong" } };
        } else {
          formState = { result: null, error: { requestError: "Something went wrong" } };
        }
      }
    } else {
      // Show validation errors if any
      formState = { result: null, error: formatZodErrors(validation.error) };
    }

    return formState;
  }

  const recoverPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      const response = await postClient<boolean>(`forgot-password`, { email });
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  return { changePassword, recoverPassword, resetPassword };
}

export { useAuth };
