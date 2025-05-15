"use client";

import { Drawer } from "@/components/drawer";
import { PageTitleBtn } from "@/components/utils";
import { AutoComplete, TextField } from "@/components/Inputs";
import { LoadingButton } from "@/components/buttons";
import { Box, Stack } from "@mui/material";
import { ErrorText } from "@/utils/typography";
import { useEffect, useState } from "react";
import { useAlertContext } from "@/contexts/AlertContext";
import { ValidationError } from "@/services/validation/zod";
import { ApiResult } from "@/utils/global-types";
import { Select } from "../Inputs/Select";
import { useCampaign } from "@/lib/api/campaign/useCampaign";
import { CampaignRecipientsGroupFormPayload, ICampaignRecipientsGroup } from "@/lib/api/campaign/types";
import { capitalizeAndSpace } from "@/services/string";
import { IState } from "@/lib/api/location/location.types";
import { GENDERS, INVITATIONSOURCES } from "@/lib/api/user/user.types";

export interface CampaignRecipientsGroupFormState {
  error: ValidationError<CampaignRecipientsGroupFormPayload>;
  result: ApiResult<ICampaignRecipientsGroup>;
}

interface Props {
  onCreate?: (data: ICampaignRecipientsGroup) => void;
  onClose?: () => void;
  data?: ICampaignRecipientsGroup | null;
  isOpen: boolean;
  states: IState[] | null;
}

function CampaignRecipientGroupForm({ onCreate, onClose, isOpen, data, states }: Props) {
  const initialState: CampaignRecipientsGroupFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();

  const { createCampaignRecipientsGroup } = useCampaign();

  const [formState, setFormState] = useState<CampaignRecipientsGroupFormPayload>({
    name: "",
  });

  const [error, setError] = useState<ValidationError<CampaignRecipientsGroupFormPayload>>({});
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose?.();
  };

  async function handleSubmit() {
    setLoading(true);

    const { error, result } = await createCampaignRecipientsGroup(initialState, formState);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Recipients updated", show: true, severity: "success" });
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

  function handleChange(field: keyof CampaignRecipientsGroupFormPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof CampaignRecipientsGroupFormPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  useEffect(() => {
    if (!data) return;
    setFormState({
      name: data?.name || "",
      stateId: data?.state?.id,
      gender: data?.gender,
      trafficSource: data?.trafficSource,
      referralId: data?.referralId,
    });
  }, [data]);

  return (
    <Drawer isOpen={isOpen} handleClose={handleClose}>
      <div className="mt-16 pb-8">
        <div className="mb-6">
          <Box px="16px">
            <PageTitleBtn hideCancel>Recipients Group</PageTitleBtn>
          </Box>

          <Stack mt="32px" spacing={"16px"} px="16px">
            <Box>
              <TextField
                onChange={(e) => handleChange("name", e.target.value)}
                name="recipientGroupName"
                value={formState?.name}
                label="Recipient group name"
              />
              {error?.name?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box>
              <AutoComplete
                fullWidth
                renderInputLabel="State"
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={(states || []).map((s) => ({ label: s.state, id: s.id }))}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(_, value: any) => {
                  if (value.id) {
                    handleChange("stateId", value.id);
                  }
                }}
                onInputChange={(_, value) => {
                  if (!value) {
                    handleChange("stateId", undefined);
                  }
                }}
                value={(states || []).find((s) => s.id === formState.stateId)?.state || undefined}
              />
              {error?.stateId?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box>
              <Select
                label="Gender"
                items={GENDERS.map((g) => ({ id: g, label: capitalizeAndSpace(g) }))}
                onChange={(e) => {
                  handleChange("gender", e.target.value as string);
                }}
                name="gender"
                value={formState?.gender}
              />
              {error?.gender?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>
            <Box>
              <Select
                label="Source"
                items={[
                  ...INVITATIONSOURCES.map((x) => ({ id: x, label: capitalizeAndSpace(x) })),
                  { id: undefined, label: "None" },
                ]}
                onChange={(e) => {
                  handleChange("trafficSource", e.target.value as string);
                }}
                name="trafficSource"
                value={formState?.trafficSource}
              />
              {error?.trafficSource?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box>
              <TextField
                onChange={(e) => handleChange("referralId", e.target.value)}
                name="referralId"
                value={formState?.referralId}
                label="Referral Id"
              />
              {error?.referralId?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>
          </Stack>
          <Box px="16px" mt="32px">
            <LoadingButton loadingPosition="end" loading={loading} onClick={handleSubmit}>
              Submit
            </LoadingButton>
          </Box>
        </div>
      </div>
    </Drawer>
  );
}

export { CampaignRecipientGroupForm };
