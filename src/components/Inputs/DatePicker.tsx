import * as React from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import {
  DateTimePicker as MuiDateTimePicker,
  DateTimePickerProps,
  DatePicker as MuiDatePicker,
  DatePickerProps,
} from "@mui/x-date-pickers";
import "dayjs/locale/en-gb";

function DateTimePicker({ sx, ...etc }: DateTimePickerProps<Dayjs>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <MuiDateTimePicker sx={{ width: "100%", ...sx }} {...etc} />
    </LocalizationProvider>
  );
}

function DatePicker({ sx, ...etc }: DatePickerProps<Dayjs>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <MuiDatePicker sx={{ width: "100%", ...sx }} {...etc} />
    </LocalizationProvider>
  );
}

export { DateTimePicker, DatePicker };
