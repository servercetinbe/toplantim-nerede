"use client";

import React from "react";
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { Repeat } from "lucide-react";

import { RecurrenceSettingsProps } from "../types/RecurrenceSettingsProps";

const getRecurrenceLabel = (type: string): string => {
  if (type === "daily") return "Günlük";
  if (type === "weekly") return "Haftalık";
  if (type === "biweekly") return "2 Haftalık";
  if (type === "monthly") return "Aylık";
  return "";
};

const RecurrenceSettings: React.FC<RecurrenceSettingsProps> = ({
  enableRecurrence,
  setEnableRecurrence,
  recurrenceType,
  setRecurrenceType,
  recurrenceEndDate,
  setRecurrenceEndDate,
  shouldDisableDate,
}) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Repeat size={24} style={{ marginRight: "12px", color: "#4338CA" }} />
      <Typography variant="h6" fontWeight={600}>
        Tekrar Ayarları
      </Typography>
    </Box>

    <FormControlLabel
      control={<Checkbox checked={enableRecurrence} onChange={e => setEnableRecurrence(e.target.checked)} />}
      label="Tekrarlayan Toplantı Seçimi"
    />
    {enableRecurrence && (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {["daily", "weekly", "biweekly", "monthly"].map(type => (
            <Button
              key={type}
              variant={recurrenceType === type ? "contained" : "outlined"}
              onClick={() => setRecurrenceType(type as "daily" | "weekly" | "biweekly" | "monthly")}
              sx={{
                flex: 1,
                borderRadius: "8px",
                backgroundColor: recurrenceType === type ? "#4338CA" : "transparent",
                color: recurrenceType === type ? "white" : "#4338CA",
                "&:hover": {
                  backgroundColor: recurrenceType === type ? "#3730A3" : "rgba(67, 56, 202, 0.04)",
                },
              }}
            >
              {getRecurrenceLabel(type)}
            </Button>
          ))}
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
          <DesktopDateTimePicker
            label="Tekrarlayan Rezervasyon Bitiş Tarihi"
            value={recurrenceEndDate}
            onChange={(newValue: Dayjs | null) => setRecurrenceEndDate(newValue)}
            shouldDisableDate={shouldDisableDate}
            renderInput={(params: React.ComponentProps<typeof TextField>) => (
              <TextField
                {...params}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "white",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(67, 56, 202, 0.04)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                      boxShadow: "0 0 0 2px rgba(67, 56, 202, 0.2)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#4338CA",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E5E7EB",
                  },
                  "& .MuiIconButton-root": {
                    color: "#4338CA",
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Box>
    )}
  </Box>
);

export default RecurrenceSettings;
