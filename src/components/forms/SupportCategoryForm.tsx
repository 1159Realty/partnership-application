"use client";

import { Drawer } from "@/components/drawer";
import { TextField } from "@/components/Inputs";
import { Box, Stack } from "@mui/material";
import { ErrorText, MobileB1MGray900, MobileH2SM } from "@/utils/typography";
import { ValidationError } from "@/services/validation/zod";
import { ApiResult } from "@/utils/global-types";
import { useAlertContext } from "@/contexts/AlertContext";
import { useState } from "react";
import { LoadingButton } from "../buttons";
import { ISupportCategory, SupportCategoryPayload } from "@/lib/api/support/types";
import { useSupport } from "@/lib/api/support/useSupport";

export interface SupportCategoryFormState {
  error: ValidationError<SupportCategoryPayload>;
  result: ApiResult<ISupportCategory>;
}

interface Props {
  onClose?: () => void;
  onCreate?: (data?: ISupportCategory | null) => void;
  isOpen: boolean;
}

function SupportCategoryForm({ onClose, onCreate, isOpen }: Props) {
  const initialState: SupportCategoryFormState = {
    error: {},
    result: null,
  };

  const { createSupportCategory } = useSupport();

  const { setAlert } = useAlertContext();

  const [formState, setFormState] = useState<SupportCategoryPayload>({
    name: "",
  });
  const [error, setError] = useState<ValidationError<SupportCategoryPayload>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof SupportCategoryPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof SupportCategoryPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  async function handleSubmit() {
    setLoading(true);
    const payload: SupportCategoryPayload = {
      name: formState.name,
    };

    const { error, result } = await createSupportCategory(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Support category created", show: true, severity: "success" });
      handleClose();
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

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Drawer isOpen={isOpen} handleClose={handleClose}>
      <Box pb="48px" mt="60px">
        <Box px="16px">
          <MobileH2SM>Category</MobileH2SM>
        </Box>
        <Stack px="16px" mt="32px" spacing={"20px"}>
          <Box>
            <Box mb="10px">
              <MobileB1MGray900>ADD CATEGORY</MobileB1MGray900>
            </Box>
            <Box>
              <TextField onChange={(e) => handleChange("name", e.target.value)} fullWidth value={formState.name} label="Name" />
              {error?.name?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>
          </Box>

          <LoadingButton onClick={handleSubmit} loading={loading} loadingPosition="end" fullWidth>
            Submit
          </LoadingButton>
        </Stack>
      </Box>
    </Drawer>
  );
}

export { SupportCategoryForm };
