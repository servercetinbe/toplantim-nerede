import { Dayjs } from "dayjs";

export interface RecurrenceSettingsProps {
  enableRecurrence: boolean;
  setEnableRecurrence: React.Dispatch<React.SetStateAction<boolean>>;
  recurrenceType: "none" | "daily" | "weekly" | "biweekly" | "monthly";
  setRecurrenceType: React.Dispatch<React.SetStateAction<"none" | "daily" | "weekly" | "biweekly" | "monthly">>;
  recurrenceEndDate: Dayjs | null;
  setRecurrenceEndDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  shouldDisableDate: (date: unknown) => boolean;
}
