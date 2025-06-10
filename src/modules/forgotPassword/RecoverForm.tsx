"use client";

import { LoadingButton } from "@/components/buttons";
import { TextField } from "@/components/Inputs";
import { useAlertContext } from "@/contexts/AlertContext";
import { AuthResponse, LoginPayload } from "@/lib/api/auth/auth.types";
import { useAuth } from "@/lib/api/auth/useAuth";
import { ValidationError } from "@/services/validation/zod";
import { ROUTES } from "@/utils/constants";
import { MobileB1LightGray900, MobileB1MGray500 } from "@/utils/typography";
import { Box, Stack } from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export interface LoginFormState {
  error: ValidationError<LoginPayload>;
  result: AuthResponse | null;
}

function RecoverPasswordForm() {
  const { setAlert } = useAlertContext();
  const { recoverPassword } = useAuth();

  const { push } = useRouter();
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get("redirect");

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const response = await recoverPassword(email);
    if (response) {
      setAlert({
        severity: "success",
        message: "Recovery email sent. Please check your inbox.",
        show: true,
      });
      push(ROUTES["/sign-in"]);
    }
    setLoading(false);
  }

  function getRedirectUri(uri: string) {
    return redirectUri ? `${uri}?redirect=${redirectUri}` : uri;
  }

  return (
    <Stack spacing={"24px"} mt="32px">
      <Box>
        <TextField type="email" fullWidth onChange={(e) => setEmail(e.target.value)} name="email" label="Email Address" />
      </Box>

      <LoadingButton type="submit" loadingPosition="end" loading={loading} onClick={handleSubmit}>
        Recover Password
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

export { RecoverPasswordForm };
