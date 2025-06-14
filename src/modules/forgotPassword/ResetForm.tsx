"use client";

import React, { useState } from "react";
import { LoadingButton } from "@/components/buttons";
import { TextField } from "@/components/Inputs";
import { useAlertContext } from "@/contexts/AlertContext";
import { PasswordResetPayload } from "@/lib/api/auth/auth.types";
import { ValidationError } from "@/services/validation/zod";
import { ROUTES } from "@/utils/constants";
import { ErrorText, MobileB1LightGray900, MobileB1MGray500 } from "@/utils/typography";
import { Box, InputAdornment, Stack } from "@mui/material";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/api/auth/useAuth";

interface Props {
  userId: string;
  token: string;
}

export interface ResetPasswordFormState {
  error: ValidationError<PasswordResetPayload>;
  result: boolean | null;
}

function ResetPasswordForm({ userId, token }: Props) {
  const { setAlert } = useAlertContext();
  const { resetPassword } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get("redirect");

  const initialState: ResetPasswordFormState = {
    error: {},
    result: null,
  };

  const [formState, setFormState] = useState<PasswordResetPayload>({
    newPassword: "",
    userId,
    token,
  });

  const [error, setError] = useState<ValidationError<PasswordResetPayload>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(field: keyof PasswordResetPayload, value: string) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    const { error, result } = await resetPassword(initialState, formState);

    if (result) {
      setAlert({
        show: true,
        message: "Password reset successful",
        severity: "success",
      });
      router.push(ROUTES["/sign-in"]);
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
    <Stack spacing={"24px"} mt="32px">
      <Box>
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          onChange={(e) => handleChange("newPassword", e.target.value)}
          name="newPassword"
          label="New Password"
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
        {error?.newPassword?.map((error, i) => (
          <Box key={i}>
            <ErrorText>{error}</ErrorText>
          </Box>
        ))}
      </Box>

      <LoadingButton type="submit" loadingPosition="end" loading={loading} onClick={handleSubmit}>
        Reset
      </LoadingButton>

      <Box textAlign={"center"} mt="30px">
        <MobileB1MGray500>
          Remember password?{" "}
          <MobileB1LightGray900>
            <Link href={getRedirectUri(ROUTES["/sign-in"])}>Sign in</Link>
          </MobileB1LightGray900>{" "}
        </MobileB1MGray500>
      </Box>
    </Stack>
  );
}

export { ResetPasswordForm };
