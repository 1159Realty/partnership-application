"use client";

import { Drawer } from "@/components/drawer";
import { DigitalClock } from "../dateTime";
import { Alert, Box, Stack } from "@mui/material";
import { Divider } from "../divider";
import { Select } from "../Inputs";
import { LoadingButton } from "../buttons";
import { PageTitleBtn } from "../utils";
import { Clock } from "@phosphor-icons/react/dist/ssr";
import {
  getDateTimeString,
  getDigitalClockDisableTime,
  getMinMaxTimeFromMinutes,
  getMinuteOfDay,
  getNextDateTime,
  sortWeekDay,
} from "@/services/dateTime";
import { ValidationError } from "@/services/validation/zod";
import {
  IAppointment,
  ScheduleAppointmentFormPayload,
  ScheduleAppointmentPayload,
} from "@/lib/api/appointment/appointment.types";
import { useState } from "react";
import { Weekday } from "@/utils/constants";
import { ErrorText } from "@/utils/typography";
import { capitalize } from "@/services/string";
import { IAvailability } from "@/lib/api/availability/availability.types";
import { Dayjs } from "dayjs";
import { ApiResult } from "@/utils/global-types";
import { useAppointment } from "@/lib/api/appointment/useAppointment";
import { useAlertContext } from "@/contexts/AlertContext";

export interface ScheduleAppointmentFormState {
  error: ValidationError<ScheduleAppointmentFormPayload>;
  result: ApiResult<IAppointment>;
}

interface Props {
  show: boolean;
  onClose?: () => void;
  onSubmit?: (appointment: IAppointment) => void;
  propertyId: string | null;
  availabilityData: IAvailability[] | null;
}

function ScheduleAppointmentForm({ show, onClose, onSubmit, propertyId, availabilityData }: Props) {
  const initialState: ScheduleAppointmentFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();
  const { createAppointment } = useAppointment();

  const [formState, setFormState] = useState<ScheduleAppointmentFormPayload>({
    weekday: "",
    period: null,
  });
  const [error, setError] = useState<ValidationError<ScheduleAppointmentFormPayload>>({});
  const [loading, setLoading] = useState(false);

  const currentAvailability = availabilityData?.find((a) => a?.weekday === formState.weekday);
  const minMaxTime = getMinMaxTimeFromMinutes(currentAvailability?.periods || []);
  const shouldDisableTime = getDigitalClockDisableTime(currentAvailability?.booked, currentAvailability?.slot);

  function handleChange(field: keyof ScheduleAppointmentFormPayload, value: string | Dayjs | null) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof ScheduleAppointmentFormPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  async function handleSubmit() {
    if (!propertyId) return;
    setLoading(true);
    const payload: ScheduleAppointmentPayload = {
      period: getMinuteOfDay(formState.period!),
      weekday: formState.weekday,
      propertyId,
      time,
    };
    const { error, result } = await createAppointment(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onSubmit?.(result);
      }
      setAlert({ message: "Availability created", show: true, severity: "success" });
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

  function handleClose() {
    onClose?.();
  }

  const getTime = () => {
    if (!formState.period || !formState.weekday) return "";
    return getNextDateTime(formState.weekday as Weekday, getMinuteOfDay(formState.period));
  };

  const time = getTime();
  const sortedWeekdays = sortWeekDay(availabilityData?.map((x) => x.weekday) || []);

  return (
    <Drawer isOpen={show} handleClose={onClose}>
      <Box pb="48px" mt="60px">
        <Box px="16px">
          <PageTitleBtn hideCancel>Schedule Appointment</PageTitleBtn>
        </Box>

        <Stack px="16px" mt="16px" spacing={"25px"}>
          <Box>
            <Select
              label="Week day"
              items={sortedWeekdays?.map((x) => ({ id: x, label: capitalize(x) })) || []}
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

          <DigitalClock
            shouldDisableTime={shouldDisableTime}
            minTime={minMaxTime.minTime || undefined}
            maxTime={minMaxTime.maxTime || undefined}
            timeStep={currentAvailability?.duration}
            value={formState.period}
            onChange={(newValue) => handleChange("period", newValue)}
          />

          {Boolean(time) && (
            <Alert variant="outlined" icon={<Clock fontSize="inherit" />} severity="warning">
              {getDateTimeString(time)}
            </Alert>
          )}
          <Divider />
          <Box px="16px">
            <LoadingButton loadingPosition="end" loading={loading} onClick={handleSubmit}>
              Schedule
            </LoadingButton>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}

export { ScheduleAppointmentForm };
