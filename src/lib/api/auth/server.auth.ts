"use server";

import { formatZodErrors } from "@/services/validation/zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/lib/api/auth/auth.types";
import { LoginFormState } from "@/modules/signin/SigninForm";
import { formatError } from "@/services/errors";
import { ApiResponse, Session } from "../api.types";
import { saveServerSession } from "@/lib/session/server";
import { ROUTES, SESSION } from "@/utils/constants";
import { postServer } from "../sever.api";
import { RegisterFormState } from "@/modules/signup/SignupForm";

async function login(initialState: LoginFormState, payload: LoginPayload): Promise<LoginFormState> {
  let formState = { ...initialState };

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().nonempty({ message: "Password cannot be empty" }),
  });

  const validation = loginSchema.safeParse(payload);

  if (validation.success) {
    let response: ApiResponse<AuthResponse> | null = null;
    try {
      response = await postServer<AuthResponse>("auth/login", validation.data);

      if (response?.result) {
        const session: Session = {
          token: {
            access: response.result?.accessToken,
            refresh: response.result?.refreshToken,
          },
          user: response.result?.user,
        };
        await saveServerSession(session);
        formState = { result: response.result, error: {} };
      } else {
        formState = { result: null, error: { requestError: response.message } };
      }
    } catch (error) {
      console.error(formatError(error));
      if (response?.error) {
        formState = { result: null, error: { requestError: response.message } };
      } else {
        formState = { result: null, error: { requestError: "Something went wrong" } };
      }
    }
  } else {
    formState = { result: null, error: formatZodErrors(validation.error) };
  }

  return formState;
}

async function register(initialState: RegisterFormState, payload: RegisterPayload): Promise<RegisterFormState> {
  let formState = { ...initialState };

  const schema = z.object({
    email: z.string().email(),
    password: z.string().nonempty({ message: "Password cannot be empty" }).min(4, { message: "Password is too short" }),
  });

  const validation = schema.safeParse(payload);

  if (validation.success) {
    let response: ApiResponse<AuthResponse> | null = null;
    try {
      const data: RegisterPayload = {
        email: payload?.email,
        password: payload?.password,
      };

      response = await postServer<AuthResponse>("auth/register", data);

      if (response?.result) {
        const session: Session = {
          token: {
            access: response.result?.accessToken,
            refresh: response.result?.refreshToken,
          },
          user: response.result?.user,
        };
        await saveServerSession(session);
        formState = { result: response.result, error: {} };
      } else {
        formState = { result: null, error: { requestError: response.message } };
      }
    } catch (error) {
      console.error(formatError(error));
      if (response?.error) {
        formState = { result: null, error: { requestError: response.message } };
      } else {
        formState = { result: null, error: { requestError: "Something went wrong" } };
      }
    }
  } else {
    formState = { result: null, error: formatZodErrors(validation.error) };
  }

  return formState;
}

async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION);
  redirect(ROUTES["/sign-in"]);
}

export { login, logout, register };
