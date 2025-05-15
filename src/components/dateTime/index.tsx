import * as React from "react";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DigitalClock as MuiDigitalClock, DigitalClockProps } from "@mui/x-date-pickers/DigitalClock";
import { TimePicker as MuiTimePicker, TimePickerProps as MuiTimePickerProps } from "@mui/x-date-pickers";

function DigitalClock({ ...props }: DigitalClockProps<Dayjs>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDigitalClock skipDisabled {...props} />
    </LocalizationProvider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TimePickerProps extends MuiTimePickerProps<any> {
  label: string;
}
function TimePicker({ label, ...props }: TimePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiTimePicker sx={{ width: "100%" }} label={label} {...props} />
    </LocalizationProvider>
  );
}

export { DigitalClock, TimePicker };
