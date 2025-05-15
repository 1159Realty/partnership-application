"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "../dialog";
import { GenericDialogWrapper } from "../dialog/dialog.styles";
import { useUserContext } from "@/contexts/UserContext";
import { getClientSession } from "@/lib/session/client";
import { BankAccountDialogEditIconWrapper, BankAccountDialogTitle, BankAccountDialogWrapper } from "./styles";
import { ShakeWrapper } from "@/styles/globals.styles";
import { Bank } from "@phosphor-icons/react/dist/ssr";
import { LoadingButton } from "../buttons";
import { COLORS } from "@/utils/colors";
import { Box, Stack } from "@mui/material";
import { AutoComplete, TextField } from "../Inputs";
import { ValidationError } from "@/services/validation/zod";
import { BankDetailFormPayload, IVerifyBankDetail, User } from "@/lib/api/user/user.types";
import { ApiResult } from "@/utils/global-types";
import { useUser } from "@/lib/api/user/useUser";
import { useSession } from "@/lib/session/client/useSession";
import { useAlertContext } from "@/contexts/AlertContext";
import { ErrorText } from "@/utils/typography";
import { getRole } from "@/lib/session/roles";
import { delay } from "@/services/delay";
import { nigerianBanksData } from "@/data/bankData";
import { StatusChip } from "../chip";
import { useDebounce } from "use-debounce";

export interface BankAccountFormState {
  error: ValidationError<BankDetailFormPayload>;
  result: ApiResult<User>;
}

interface Props {
  isManualOpen?: boolean;
  onManualClose?: () => void;
}

function UpdateBankAccountForm({ isManualOpen, onManualClose }: Props) {
  const initialState: BankAccountFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();
  const { userData } = useUserContext();

  const { updateAccountDetails, verifyBankDetails } = useUser();
  const { updateSession } = useSession();

  const [formState, setFormState] = useState<BankDetailFormPayload>({
    bankAccountNumber: "",
    bank: {
      label: "",
      id: "",
    },
  });

  const [error, setError] = useState<ValidationError<BankDetailFormPayload>>({});
  const [loading, setLoading] = useState(false);
  const [verifyBankDetail, setVerifyBankDetail] = useState<IVerifyBankDetail | null>(null);

  const [canOpen, setCanOpen] = useState(false);

  const isAuthenticated = getClientSession();

  const isAutoOpen = Boolean(
    isAuthenticated && !userData?.bankAccountNumber && userData?.isCompleted && getRole(userData?.roleId) === "agent" && canOpen
    // TODO: add can open condition
  );

  const [debouncedAccountNumber] = useDebounce(formState?.bankAccountNumber, 700);

  async function handleSubmit() {
    setLoading(true);
    const { error, result } = await updateAccountDetails(initialState, formState);

    if (result && typeof result === "object") {
      updateSession(result);
      setAlert({ message: "Bank details saved!", show: true, severity: "success" });
      if (isManualOpen) {
        onManualClose?.();
      }
    } else {
      if (error.requestError) {
        setAlert({ message: error.requestError, show: true, severity: "error" });
        delete error.requestError;
      } else if (Object.keys(error).length) {
        setError(error);
        setAlert({ message: "Complete the required fields", show: true, severity: "error" });
      }
    }
    setLoading(false);
  }

  function handleChange(field: keyof BankDetailFormPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof BankDetailFormPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  useEffect(() => {
    async function get() {
      if (debouncedAccountNumber?.length < 10 || !formState?.bank?.id) return;
      const response = await verifyBankDetails(debouncedAccountNumber, formState?.bank?.id);
      setVerifyBankDetail(response);
    }
    get();
  }, [formState?.bank?.id, debouncedAccountNumber, verifyBankDetails]);

  useEffect(() => {
    if (!userData) return;

    setFormState({
      bankAccountNumber: userData?.bankAccountNumber,
      bank: {
        label: userData?.bankName,
        id: userData?.bankCode,
      },
    });
  }, [userData]);

  const handleCanOpen = React.useCallback(async () => {
    await delay(10);
    if (isAuthenticated && !canOpen) {
      setCanOpen(true);
    }
  }, [canOpen, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCanOpen(false);
    } else {
      handleCanOpen();
    }
  }, [handleCanOpen, isAuthenticated]);

  return (
    <Dialog
      disableOverlayClick={!isManualOpen}
      disableEsc={!isManualOpen}
      onClose={onManualClose}
      isOpen={Boolean(isAutoOpen || isManualOpen)}
    >
      <GenericDialogWrapper>
        <BankAccountDialogWrapper>
          <ShakeWrapper mb="10px">
            <BankAccountDialogEditIconWrapper>
              <Bank size={40} weight="duotone" color={COLORS.blackNormal} />
            </BankAccountDialogEditIconWrapper>
          </ShakeWrapper>
          <BankAccountDialogTitle>Set up your bank details</BankAccountDialogTitle>
          <Stack px="16px" spacing={"20px"} mt="32px">
            <Box>
              <TextField
                onChange={(e) => handleChange("bankAccountNumber", e.target.value)}
                name="bankAccountNumber"
                value={formState?.bankAccountNumber}
                label="Account number"
              />
              {error?.bankAccountNumber?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box>
              <AutoComplete
                fullWidth
                renderInputLabel="Bank"
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={nigerianBanksData.map((x) => ({ label: x.name, id: x.code }))}
                onChange={(_, value) => {
                  if (value) {
                    handleChange("bank", value);
                  }
                }}
                onInputChange={(_, value) => {
                  if (!value) {
                    handleChange("bank", "");
                  }
                }}
                value={formState?.bank?.label || ""}
              />
              {error?.bank?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>
            {Boolean(verifyBankDetail?.account_name.trim()) && <StatusChip value={verifyBankDetail?.account_name || ""} />}
          </Stack>
          <div className="mt-8">
            <LoadingButton loading={loading} loadingPosition="end" onClick={handleSubmit} fullWidth>
              Save
            </LoadingButton>
          </div>
        </BankAccountDialogWrapper>
      </GenericDialogWrapper>
    </Dialog>
  );
}

export { UpdateBankAccountForm };
