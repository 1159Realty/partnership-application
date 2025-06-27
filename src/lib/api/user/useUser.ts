import { formatError } from "@/services/errors";
import {
  AgentType,
  AssignRolePayload,
  BankDetailFormPayload,
  BankDetailPayload,
  ClientReportTotal,
  FetchUsersArg,
  GenderReport,
  IVerifyBankDetail,
  TrafficReport,
  User,
  UserFormPayload,
  UserPayload,
  UserRolePayload,
} from "./user.types";
import { ApiResponse, PaginatedResponse, Session } from "../api.types";
import { useCallback } from "react";
import { UserFormState } from "@/components/forms/OnboardClient";
import { z } from "zod";
import { formatPhoneNumber, phoneNumberToReferralId } from "@/services/string";
import { formatZodErrors } from "@/services/validation/zod";
import { getClientSession, updateClientSessionUser } from "@/lib/session/client";
import { getClient, putClient } from "../client.api";
import { UserRoleFormState } from "@/components/forms/TeamForm";
import { getRole } from "@/lib/session/roles";
import { BankAccountFormState } from "@/components/forms/UpdateBankAccountForm";
import { uploadFile } from "../file-upload";

function useUser() {
  const fetchUserData = useCallback(async (): Promise<User | null> => {
    let session: Session | null = null;
    try {
      session = getClientSession();
      const userId = session?.user?.id;
      if (!userId) return null;

      const response = await getClient<User>(`users/${session?.user?.id}`);
      if (response?.result) {
        await updateClientSessionUser(response.result);
        return response.result;
      }
      return null;
    } catch (error) {
      console.error(`Unable to fetch user with id=${session?.user?.id}\n. ${formatError(error)}`);
      return null;
    }
  }, []);

  const fetchUsers = useCallback(async (args?: FetchUsersArg): Promise<PaginatedResponse<User> | null> => {
    let session: Session | null = null;
    try {
      session = getClientSession();
      const userId = session?.user?.id;
      if (!userId) return null;

      const response = await getClient<PaginatedResponse<User>>(`users?page=${args?.page || 1}&limit=${args?.limit || 10}${
        args?.keyword ? `&keyword=${args.keyword}` : ""
      }${args?.roleId ? `&roleId=${args.roleId}` : ""}
${args?.referralId ? `&referralId=${phoneNumberToReferralId(args.referralId)}` : ""}
${args?.byClientOnly ? `&byClientOnly=${args.byClientOnly}` : ""}
${args?.byModerators ? `&byModerators=${args.byModerators}` : ""}
${args?.sort ? `&sort=${args.sort}` : ""}`);
      if (response?.result) {
        return response.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const fetchUserById = useCallback(async (id: string): Promise<User | null> => {
    try {
      const response = await getClient<User>(`users/${id}`);
      if (response?.result) {
        return response.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  async function onboardUser(initialState: UserFormState, payload: UserFormPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      firstName: z.string().nonempty({ message: "This field is required" }),
      lastName: z.string().nonempty({ message: "This field is required" }),
      residentialAddress: z.string().optional(),
      phoneNumber: z.string().superRefine((phoneNumber, ctx) => {
        if (!phoneNumber.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This field is required",
          });
          return;
        }

        if (!formatPhoneNumber(phoneNumber)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid phone number",
          });
          return;
        }
      }),
      profilePic: z
        .any()
        .superRefine((file, ctx) => {
          if (file && !(file instanceof File)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Invalid file format",
            });
            return;
          }
        })
        .optional(),
      gender: z.string().optional(),
      stateId: z.string().optional(),
      trafficSource: z.any().optional(),
      referralId: z.string().optional(),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<User> | null = null;

      try {
        let profilePic = "";
        // upload image to cloudinary
        if (payload?.profilePic && typeof payload.profilePic !== "string") {
          const uploadedImageResponse = await uploadFile(payload?.profilePic, "profile-picture");
          if (uploadedImageResponse) {
            profilePic = uploadedImageResponse?.url;
          }
        }

        const data: UserPayload = {
          firstName: payload?.firstName,
          lastName: payload?.lastName,
          phoneNumber: formatPhoneNumber(payload?.phoneNumber) || "",
          residentialAddress: payload?.residentialAddress || undefined,
          profilePic: profilePic || undefined,
          stateId: payload?.stateId || undefined,
          gender: payload?.gender || undefined,
          referralId: phoneNumberToReferralId(payload?.referralId || "") || undefined,
          trafficSource: payload?.trafficSource,
        };

        const session = getClientSession();
        response = await putClient<User>(`users/${session?.user?.id}`, data);

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
          formState = { result: null, error: { requestError: "Something went wrong" } };
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

  async function updateUserProfile(initialState: UserFormState, payload: UserFormPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      firstName: z.string().nonempty({ message: "This field is required" }),
      lastName: z.string().nonempty({ message: "This field is required" }),
      residentialAddress: z.string().optional(),
      phoneNumber: z.string().superRefine((phoneNumber, ctx) => {
        if (!phoneNumber.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This field is required",
          });
          return;
        }

        if (!formatPhoneNumber(phoneNumber)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid phone number",
          });
          return;
        }
      }),
      profilePic: z.any().superRefine((file, ctx) => {
        if (file && !(file instanceof File)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid file format",
          });
          return;
        }
      }),
      gender: z.string().optional(),
      trafficSource: z.any().optional(),
      referralId: z.string().optional(),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<User> | null = null;

      try {
        let profilePic = "";
        // upload image to cloudinary
        if (payload?.profilePic && typeof payload.profilePic !== "string") {
          const uploadedImageResponse = await uploadFile(payload?.profilePic, "profile-picture");
          if (uploadedImageResponse) {
            profilePic = uploadedImageResponse?.url;
          }
        }

        const data: UserPayload = {
          firstName: payload?.firstName,
          lastName: payload?.lastName,
          phoneNumber: formatPhoneNumber(payload?.phoneNumber) || "",
          residentialAddress: payload?.residentialAddress || undefined,
          profilePic: profilePic || undefined,
          stateId: payload?.stateId || undefined,
          gender: payload?.gender || undefined,
          referralId: phoneNumberToReferralId(payload?.referralId || "") || undefined,
          trafficSource: payload?.trafficSource,
        };

        const session = getClientSession();
        response = await putClient<User>(`users/${session?.user?.id}`, data);

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

  async function addRole(initialState: UserRoleFormState, payload: UserRolePayload) {
    let formState = { ...initialState };

    const schema = z.object({
      userId: z.string().nonempty({ message: "This field is required" }),
      roleId: z.string().nonempty({ message: "This field is required" }),
      agentType: z.string().optional(),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response: ApiResponse<User> | null = null;

      try {
        const data: AssignRolePayload = { roleId: validation?.data?.roleId };
        if (getRole(data.roleId) === "agent") {
          data.agentType = validation?.data?.agentType as AgentType;
        }

        response = await putClient<User>(`users/change-role/${validation.data?.userId}`, data);
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

  async function updateAccountDetails(initialState: BankAccountFormState, payload: BankDetailFormPayload) {
    let formState = { ...initialState };

    const schema = z.object({
      bankAccountNumber: z.string({ message: "This field is required" }),
      bank: z.any({ message: "This field is required" }),
    });

    const validation = schema.safeParse(payload);

    if (validation.success) {
      let response;
      try {
        const data: BankDetailPayload = {
          bankAccountNumber: validation.data.bankAccountNumber,
          bankCode: validation.data.bank?.id,
          bankName: validation.data.bank?.label,
        };
        response = await putClient<User>(`users/update-bank`, data);

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

  const verifyBankDetails = useCallback(
    async (bankAccountNumber: string, bankCode: string): Promise<IVerifyBankDetail | null> => {
      try {
        const response = await getClient<IVerifyBankDetail | null>(
          `payments/bank-resolver?account_number=${bankAccountNumber}&bank_code=${bankCode}`
        );
        if (response?.statusCode === 200) {
          return response.result;
        }
        return null;
      } catch (error) {
        console.error(formatError(error));
        return null;
      }
    },
    []
  );

  const fetchClientReportTotal = useCallback(async (): Promise<ClientReportTotal | null> => {
    try {
      const response = await getClient<ClientReportTotal | null>(`invoices/totals`);
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const fetchGenderReport = useCallback(async (): Promise<GenderReport | null> => {
    try {
      const response = await getClient<GenderReport | null>(`invoices/totals`);
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const fetchTrafficReport = useCallback(async (): Promise<TrafficReport[] | null> => {
    try {
      const response = await getClient<TrafficReport[] | null>(`invoices/totals`);
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  return {
    fetchUserData,
    onboardUser,
    fetchUsers,
    updateUserProfile,
    addRole,
    fetchUserById,
    updateAccountDetails,
    verifyBankDetails,
    fetchClientReportTotal,
    fetchGenderReport,
    fetchTrafficReport,
  };
}

export { useUser };
