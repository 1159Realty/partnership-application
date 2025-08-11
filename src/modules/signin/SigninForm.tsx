"use client";

import { LoadingButton } from "@/components/buttons";
import { TextField } from "@/components/Inputs";
import { useAlertContext } from "@/contexts/AlertContext";
import { Session } from "@/lib/api/api.types";
import { AuthResponse, LoginPayload } from "@/lib/api/auth/auth.types";
import { login } from "@/lib/api/auth/server.auth";
import { useSession } from "@/lib/session/client/useSession";
import { ValidationError } from "@/services/validation/zod";
import { ROUTES } from "@/utils/constants";
import { ErrorText, MobileB1LightGray900, MobileB1MGray500, MobileB1MGray900, MobileCap2MGray500 } from "@/utils/typography";
import { Box, InputAdornment, Stack } from "@mui/material";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export interface LoginFormState {
  error: ValidationError<LoginPayload>;
  result: AuthResponse | null;
}

function SigninForm() {
  const { setAlert } = useAlertContext();
  const { saveSession } = useSession();

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get("redirect");

  const initialState: LoginFormState = {
    error: {},
    result: null,
  };

  const [formState, setFormState] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<ValidationError<LoginPayload>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(field: keyof LoginPayload, value: string) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    const { error, result } = await login(initialState, formState);

    if (result) {
      const session: Session = {
        token: {
          access: result?.accessToken,
          refresh: result?.refreshToken,
        },
        user: result.user,
      };
      saveSession(session);
      if (redirectUri) {
        router.push(redirectUri);
      } else {
        router.push(ROUTES["/"]);
      }
      return;
    }

    if (error.requestError) {
      setAlert({ message: error.requestError, show: true, severity: "error" });
      delete error.requestError;
    } else if (Object.keys(error).length) {
      setError(error);
      setAlert({ message: "Complete the required fields", show: true, severity: "error" });
    }
    setLoading(false);
  }

  function getRedirectUri(uri: string) {
    return redirectUri ? `${uri}?redirect=${redirectUri}` : uri;
  }

  return (
    <Stack spacing={"24px"}>
      <Box textAlign={"center"}>
        <MobileCap2MGray500>Enter your details below correctly</MobileCap2MGray500>
      </Box>
      <Box mt="15px">
        <TextField
          type="email"
          fullWidth
          onChange={(e) => handleChange("email", e.target.value.toLocaleLowerCase())}
          name="email"
          label="Email Address"
        />
        {error?.email?.map((error, i) => (
          <Box key={i}>
            <ErrorText>{error}</ErrorText>
          </Box>
        ))}
      </Box>

      <Box>
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          onChange={(e) => handleChange("password", e.target.value)}
          name="password"
          label="Password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  {showPassword ? (
                    <EyeSlash onClick={() => setShowPassword((prev) => !prev)} cursor={"pointer"} />
                  ) : (
                    <Eye onClick={() => setShowPassword((prev) => !prev)} cursor={"pointer"} />
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack width={"100%"} alignItems={"flex-end"}>
          <Link href={getRedirectUri(ROUTES["/forgot-password"])}>
            <MobileB1MGray900>Forgot password?</MobileB1MGray900>
          </Link>
        </Stack>
        {error?.password?.map((error, i) => (
          <Box key={i}>
            <ErrorText>{error}</ErrorText>
          </Box>
        ))}
      </Box>

      <LoadingButton type="submit" loadingPosition="end" loading={loading} onClick={handleSubmit}>
        Login
      </LoadingButton>

      <Box textAlign={"center"} mt="30px">
        <MobileB1MGray500>
          Don’t have an account?{" "}
          <MobileB1LightGray900>
            <Link href={getRedirectUri(ROUTES["/sign-up"])}>Create Account</Link>
          </MobileB1LightGray900>{" "}
        </MobileB1MGray500>
      </Box>
    </Stack>
  );
}

export { SigninForm };
