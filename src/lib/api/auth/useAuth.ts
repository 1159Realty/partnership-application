import { formatError } from "@/services/errors";
import { ApiResponse } from "../api.types";
import { z } from "zod";
import { formatZodErrors } from "@/services/validation/zod";
import { putClient } from "../client.api";
import { ChangePasswordFormState } from "@/components/forms/UpdateProfileForm";
import { ChangePasswordPayload } from "./auth.types";

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

  return { changePassword };
}

export { useAuth };
