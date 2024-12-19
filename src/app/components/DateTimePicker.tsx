"use client";

import React from "react";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";

interface DateTimePickerProps {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  shouldDisableDate?: (date: unknown) => boolean;
  minDateTime?: Dayjs;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ label, value, onChange, shouldDisableDate, minDateTime }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
    <DesktopDateTimePicker
      label={label}
      value={value}
      onChange={value => onChange(value as Dayjs | null)}
      shouldDisableDate={shouldDisableDate}
      minDateTime={minDateTime}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />
      )}
    />
  </LocalizationProvider>
);

export default DateTimePicker;
