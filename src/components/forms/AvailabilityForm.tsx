"use client";

import { Drawer } from "@/components/drawer";
import { PageTitleBtn } from "@/components/utils";
import { TextField } from "@/components/Inputs";
import { LoadingButton } from "@/components/buttons";
import { Box, InputAdornment, Stack } from "@mui/material";
import { ErrorText } from "@/utils/typography";
import { useState } from "react";
import { useAlertContext } from "@/contexts/AlertContext";
import { ValidationError } from "@/services/validation/zod";
import { ApiResult } from "@/utils/global-types";
import { Select } from "../Inputs/Select";
import { TimePicker } from "../dateTime";
import { WEEKDAYS } from "@/utils/constants";
import { capitalize } from "@/services/string";
import { Dayjs } from "dayjs";
import { useAvailability } from "@/lib/api/availability/useAvailability";
import { AvailabilityFormPayload, AvailabilityPayload, IAvailability } from "@/lib/api/availability/availability.types";

export interface AvailabilityFormState {
  error: ValidationError<AvailabilityPayload>;
  result: ApiResult<IAvailability>;
}

interface AvailabilityFormProps {
  onCreate?: (availability: IAvailability) => void;
  show: boolean;
  onClose?: () => void;
}

function AvailabilityForm({ show, onClose: handleClose, onCreate }: AvailabilityFormProps) {
  const initialState: AvailabilityFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();
  const { createAvailability } = useAvailability();

  const [formState, setFormState] = useState<AvailabilityFormPayload>({
    weekday: "",
    resumption: null,
    closing: null,
    slot: "",
    duration: "",
  });
  const [error, setError] = useState<ValidationError<AvailabilityFormPayload>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof AvailabilityFormPayload, value: string | Dayjs | null) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof AvailabilityFormPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  async function handleCreate() {
    setLoading(true);
    const payload: AvailabilityFormPayload = {
      ...formState,
      duration: parseInt(formState.duration as string),
      slot: parseInt(formState.slot as string),
    };
    const { error, result } = await createAvailability(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Availability created", show: true, severity: "success" });
      onClose();
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

  const onClose = () => {
    handleClose?.();
  };

  return (
    <Drawer isOpen={show} handleClose={onClose}>
      <Box pb="48px" mt="60px">
        <Box px="16px">
          <PageTitleBtn hideCancel>Add schedule</PageTitleBtn>
        </Box>

        <Stack mt="16px" spacing={"25px"}>
          <Box px="16px">
            <Select
              label="Week day"
              items={WEEKDAYS.map((day) => ({ id: day, label: capitalize(day) }))}
              onChange={(e) => {
                handleChange("weekday", e.target.value as string);
              }}
              name="weekday"
              value={formState.weekday}
            />
            {error?.weekday?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <TimePicker
              value={formState.resumption}
              onChange={(value: Dayjs | null) => {
                handleChange("resumption", value);
              }}
              views={["hours", "minutes"]}
              label="Resumption"
            />
            {error?.resumption?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <TimePicker
              value={formState.closing}
              onChange={(value: Dayjs | null) => {
                handleChange("closing", value);
              }}
              views={["hours", "minutes"]}
              label="Closing"
            />
            {error?.closing?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <TextField
              fullWidth
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="start">Minutes</InputAdornment>,
                },
              }}
              value={formState.duration}
              onChange={(e) => {
                handleChange("duration", e.target.value as string);
              }}
              label="Duration"
            />
            {error?.duration?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <TextField
              fullWidth
              value={formState.slot}
              onChange={(e) => {
                handleChange("slot", e.target.value as string);
              }}
              label="Slot"
            />
            {error?.slot?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <LoadingButton loadingPosition="end" loading={loading} onClick={handleCreate}>
              Submit
            </LoadingButton>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}

export { AvailabilityForm };
