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
import { AreaPayload, IArea, ILga, IState } from "@/lib/api/location/location.types";
import { useLocation } from "@/lib/api/location/useLocation";

export interface AreaFormState {
  error: ValidationError<AreaPayload>;
  result: ApiResult<IArea>;
}

interface LocationFormProps {
  onCreate?: (area?: IArea) => void;
  onClose?: () => void;
  isOpen: boolean;
  states: IState[] | null;
  area: IArea | null;
}

function LocationForm({ onCreate, onClose, isOpen, states, area }: LocationFormProps) {
  const initialState: AreaFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();

  const { addArea, fetchLgas } = useLocation();

  const [formState, setFormState] = useState<AreaPayload>({
    stateId: "",
    lgaId: "",
    area: "",
  });
  const [error, setError] = useState<ValidationError<AreaPayload>>({});
  const [loading, setLoading] = useState(false);

  const [lgas, setLgas] = useState<ILga[] | null>([]);

  const isUpdate = Boolean(area);

  const handleClose = () => {
    onClose?.();
  };

  async function handleSubmit() {
    setLoading(true);

    const { error, result } = isUpdate
      ? await addArea(initialState, formState, area?.id)
      : await addArea(initialState, formState);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Area added", show: true, severity: "success" });
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

  function handleChange(field: keyof AreaPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof AreaPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  useEffect(() => {
    async function populateLgas() {
      if (!formState?.stateId) return;
      const response = await fetchLgas(formState.stateId);
      setLgas(response);
    }

    populateLgas();
  }, [fetchLgas, formState.stateId]);

  useEffect(() => {
    if (area) {
      setFormState({
        stateId: area?.state?.id || "",
        lgaId: area?.lga?.id || "",
        area: area?.area?.trim() || "",
      });
    }
  }, [area]);

  return (
    <Drawer isOpen={isOpen} handleClose={onClose}>
      <div className="mt-16 pb-8">
        <div className="mb-6">
          <Box px="16px">
            <PageTitleBtn hideCancel>{isUpdate ? "Update area" : "Add new location"}</PageTitleBtn>
          </Box>

          <Stack mt="24px" spacing={"16px"} px="16px">
            <Box>
              <AutoComplete
                disabled={isUpdate}
                fullWidth
                options={(states || []).map((s) => ({ label: s.state, id: s.id }))}
                renderInputLabel="State"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(_, value: any) => {
                  if (value.id) {
                    handleChange("stateId", value.id);
                  }
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onInputChange={(_, value: any) => {
                  if (!value) {
                    handleChange("stateId", undefined);
                  }
                }}
                value={(states || []).find((s) => s.id === formState.stateId)?.state || ""}
              />
              {error?.area?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box>
              <AutoComplete
                disabled={isUpdate}
                fullWidth
                options={(lgas || []).map((lga) => ({ label: lga.lga, id: lga.id }))}
                renderInputLabel="Lga"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(_, value: any) => {
                  if (value.id) {
                    handleChange("lgaId", value.id);
                  }
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onInputChange={(_, value: any) => {
                  if (!value && !isUpdate) {
                    handleChange("lgaId", "");
                  }
                }}
                value={(lgas || []).find((lga) => lga.id === formState.lgaId)?.lga || ""}
              />
              {error?.area?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box>
              <TextField
                fullWidth
                onChange={(e) => handleChange("area", e.target.value)}
                name="area"
                value={formState.area}
                label="Name"
              />
              {error?.area?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box>
              <LoadingButton loadingPosition="end" loading={loading} onClick={handleSubmit}>
                {isUpdate ? "Update Area" : "Add Area"}
              </LoadingButton>
            </Box>
          </Stack>
        </div>
      </div>
    </Drawer>
  );
}

export { LocationForm };
