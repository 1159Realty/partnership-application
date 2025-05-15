"use client";

import { Drawer } from "@/components/drawer";
import { PageTitleBtn } from "@/components/utils";
import { TextField } from "@/components/Inputs";
import { Box, Stack } from "@mui/material";
import { ErrorText } from "@/utils/typography";
import { AutoComplete } from "../Inputs/AutoComplete";
import { ValidationError } from "@/services/validation/zod";
import { ApiResult } from "@/utils/global-types";
import { useAlertContext } from "@/contexts/AlertContext";
import { useEffect, useState } from "react";
import { LoadingButton } from "../buttons";
import { PaginatedResponse } from "@/lib/api/api.types";
import { ISupport, ISupportCategory, SupportFormPayload, SupportPayload } from "@/lib/api/support/types";
import { useSupport } from "@/lib/api/support/useSupport";

export interface SupportTicketFormState {
  error: ValidationError<SupportPayload>;
  result: ApiResult<ISupport>;
}

interface Props {
  onClose?: () => void;
  onCreate?: (data?: ISupport | null) => void;
  isOpen: boolean;
  support?: ISupport | null;
  supportCategories: PaginatedResponse<ISupportCategory> | null;
}

function SupportForm({ onClose, onCreate, isOpen, support, supportCategories }: Props) {
  const initialState: SupportTicketFormState = {
    error: {},
    result: null,
  };

  const { createSupportTicket } = useSupport();
  const { setAlert } = useAlertContext();

  const [formState, setFormState] = useState<SupportFormPayload>({
    message: "",
  });
  const [error, setError] = useState<ValidationError<SupportPayload>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof SupportFormPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof SupportFormPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  async function handleSubmit() {
    setLoading(true);
    const payload: SupportPayload = {
      message: formState.message,
      supportCategoryId: formState?.supportCategoryId?.id,
      supportId: support?.id,
    };

    const { error, result } = await createSupportTicket(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Support ticket created", show: true, severity: "success" });
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

  useEffect(() => {
    async function populate() {
      if (support) {
        setFormState({
          supportCategoryId: {
            label: support?.supportCategory?.name || "",
            id: support?.supportCategory?.id,
          },
          message: support?.message,
        });
      }
    }

    populate();
  }, [support]);

  return (
    <Drawer isOpen={isOpen} handleClose={handleClose}>
      <Box pb="48px" mt="60px">
        <Box px="16px">
          <PageTitleBtn hideCancel>Support ticket</PageTitleBtn>
        </Box>

        <Stack mt="16px" spacing={"25px"}>
          <Box px="16px">
            <TextField
              onChange={(e) => handleChange("message", e.target.value)}
              fullWidth
              value={formState.message}
              label="Message"
              multiline
              rows={4}
            />
            {error?.message?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <AutoComplete
              fullWidth
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={(supportCategories?.items || []).map((s) => ({ label: s?.name, id: s?.id }))}
              renderInputLabel="Support category"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(_, value: any) => {
                if (value) {
                  handleChange("supportCategoryId", value);
                }
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onInputChange={(_, value: any) => {
                if (!value) {
                  handleChange("supportCategoryId", "");
                }
              }}
              value={formState?.supportCategoryId?.label}
            />
            {error?.supportCategoryId?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <LoadingButton loadingPosition="end" loading={loading} onClick={handleSubmit}>
              Submit
            </LoadingButton>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}

export { SupportForm };
