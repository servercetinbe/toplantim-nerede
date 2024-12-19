"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { Building2, CalendarClock, Users } from "lucide-react";

import "dayjs/locale/tr";

import { checkReservationConflict } from "@/utils/conflictCheck";
import { getReservationsFromStorage, saveReservationToStorage } from "@/utils/reservationStorage";
import updateLocale from "dayjs/plugin/updateLocale";

import CompanySelector from "../components/CompanySelector";
import DateTimePicker from "../components/DateTimePicker";
import NextMeetingAlert from "../components/NextMeetingAlert";
import RoomSelector from "../components/RoomSelector";
import { companies } from "../constants/companies";
import { officialHolidays } from "../constants/dates";
import useFetchUsers from "../hooks/useFetchUsers";
import { Reservation, Room } from "../types/Reservation";
import dynamic from "next/dynamic";

dayjs.extend(updateLocale);
dayjs.updateLocale("tr", {
  weekStart: 1,
});

const HomePage = (): React.ReactElement => {
  const { user, isSignedIn } = useUser();
  const { users } = useFetchUsers();
  const [meetingRooms, setMeetingRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const router = useRouter();
  const [enableRecurrence, setEnableRecurrence] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<"none" | "daily" | "weekly" | "biweekly" | "monthly">("none");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    const reservations = getReservationsFromStorage();
    reservations.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    setReservations(reservations);
  }, []);

  const shouldDisableDate = (date: unknown) => {
    const day = (date as Dayjs).day();
    const isWeekend = day === 0 || day === 6;
    const isHoliday = officialHolidays.includes((date as Dayjs).format("YYYY-MM-DD"));
    const isPastDate = dayjs().isAfter(date as Dayjs, "day");
    return isWeekend || isHoliday || isPastDate;
  };

  const handleStartTimeChange = (newValue: Dayjs | null) => {
    setStartTime(newValue);
    if (newValue) {
      setEndTime(newValue.add(1, "hour"));
    }
  };

  const calculateRecurrenceInterval = () => {
    if (recurrenceType === "daily") return 1;
    if (recurrenceType === "weekly") return 7;
    if (recurrenceType === "biweekly") return 14;
    if (recurrenceType === "monthly") return 28;
    return 1;
  };

  const handleReservation = () => {
    if (!selectedRoom || !startTime || !endTime) {
      showSnackbar("Lütfen tüm gerekli alanları doldurun", "error");
      return;
    }

    if (!isSignedIn) {
      showSnackbar("Rezervasyon yapmak için giriş yapmalısınız", "error");
      return;
    }

    if (enableRecurrence && !recurrenceEndDate) {
      showSnackbar("Lütfen tekrarlayan rezervasyon bitiş tarihini seçin", "error");
      return;
    }

    const email = user?.primaryEmailAddress?.emailAddress || "guest@example.com";
    const name = user?.fullName || user?.username || email;
    const room = meetingRooms.find(r => r.id === selectedRoom);
    const selectedParticipants = users
      .filter(usr => participants.includes(usr.id))
      .map(usr => ({
        id: usr.id,
        name: `${usr.first_name} ${usr.last_name}`,
        first_name: usr.first_name,
        last_name: usr.last_name,
        email: usr.email,
      }));

    const newReservations: Reservation[] = [];
    const interval = calculateRecurrenceInterval();
    const endDate = enableRecurrence ? recurrenceEndDate : startTime;
    let currentDate = startTime;

    while (
      currentDate &&
      endDate &&
      (enableRecurrence
        ? currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")
        : newReservations.length < 1)
    ) {
      const newStartTime = currentDate;
      const newEndTime = endTime
        ?.set("date", currentDate.date())
        .set("month", currentDate.month())
        .set("year", currentDate.year());

      if (newStartTime && newEndTime && (shouldDisableDate(newStartTime) || shouldDisableDate(newEndTime))) {
        currentDate = currentDate.add(interval, recurrenceType === "monthly" ? "day" : "day");
        continue;
      }

      if (
        newStartTime &&
        newEndTime &&
        checkReservationConflict(newStartTime.toString(), newEndTime.toString(), selectedRoom)
      ) {
        showSnackbar(`Çakışan rezervasyon: ${newStartTime.format("DD/MM/YYYY")}`, "error");
        return;
      }

      const newReservation: Reservation = {
        id: String(new Date().getTime() + newReservations.length),
        roomId: selectedRoom,
        startTime: newStartTime.toString(),
        endTime: newEndTime?.toString() || "",
        room: room ? { id: room.id, name: room.name, capacity: room.capacity } : undefined,
        user: { id: user?.id || "guest", name, email },
        participants: selectedParticipants,
      };

      newReservations.push(newReservation);
      currentDate = currentDate.add(interval, recurrenceType === "monthly" ? "day" : "day");
    }

    if (newReservations.length === 0) {
      showSnackbar("Rezervasyon yapılamadı. Tüm tarihler uygun değil.", "error");
      return;
    }

    newReservations.forEach(reservation => saveReservationToStorage(reservation));
    showSnackbar("Rezervasyon başarıyla yapıldı", "success");

    const updatedReservations = [...reservations, ...newReservations];
    updatedReservations.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    setReservations(updatedReservations);

    resetForm();

    setTimeout(() => {
      router.push("/my-reservations");
    }, 750);
  };

  const resetForm = () => {
    setStartTime(null);
    setEndTime(null);
    setParticipants([]);
    setRecurrenceType("none");
    setEnableRecurrence(false);
    setRecurrenceEndDate(null);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const AsyncUserSelectbox = dynamic(() => import('../components/AsyncUserSelectbox '), {
    loading: () => <div className="w-full h-12 animate-pulse bg-gray-200 rounded-md" />,
    ssr: false
  });

  const RecurrenceSettings = dynamic(() => import('../components/RecurrenceSettings'), {
    loading: () => <div className="w-full h-32 animate-pulse bg-gray-200 rounded-md" />
  });

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          py: 2,
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #6B8DD6 0%, #4338CA 100%)",
            borderRadius: "24px",
            p: { xs: 2, md: 3 },
            mb: 2,
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography
            component="h1"
            aria-label="Toplantı odası rezervasyonu ana başlığı"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              mb: 1,
            }}
          >
            Toplantı Odası Rezervasyonu
          </Typography>
          <Typography
            variant="subtitle1"
            aria-label="Sistem açıklaması: Verimli toplantılar için rezervasyon sistemi"
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              opacity: 0.9,
              fontWeight: 500,
              letterSpacing: "0.5px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Verimli toplantılar için rezervasyon sistemi
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            overflow: "auto",
            p: 3,
            borderRadius: "20px",
            backgroundColor: "white",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <Grid container spacing={3}>
            {/* Selection Headers Row */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Building2 size={24} style={{ marginRight: "12px", color: "#4338CA" }} />
                  <Typography component="h2" variant="h6" fontWeight={600} aria-label="Firma ve Oda Seçimi Alanı">
                    Firma ve Oda Seçimi
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarClock size={24} style={{ marginRight: "12px", color: "#4338CA" }} />
                  <Typography component="h2" variant="h6" fontWeight={600} aria-label="Toplantı Saati Seçim Alanı">
                    Zaman Seçimi
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Selection Content */}
            <Grid item xs={12} md={6} lg={6}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                  <CompanySelector
                    companies={companies}
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                    setMeetingRooms={setMeetingRooms}
                    aria-label="Firma Seçici"
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <RoomSelector
                    meetingRooms={meetingRooms}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                    aria-label="Oda Seçici"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                    <DateTimePicker
                      label="Başlangıç Zamanı"
                      value={startTime}
                      onChange={(value: Dayjs | null) => handleStartTimeChange(value)}
                      shouldDisableDate={shouldDisableDate}
                      aria-label="Başlangıç Zamanı Seçici"
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Bitiş Zamanı"
                    value={endTime}
                    onChange={(newValue: Dayjs | null) => setEndTime(newValue)}
                    shouldDisableDate={shouldDisableDate}
                    minDateTime={startTime || undefined}
                    aria-label="Bitiş Zamanı Seçici"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <RecurrenceSettings
                enableRecurrence={enableRecurrence}
                setEnableRecurrence={setEnableRecurrence}
                recurrenceType={recurrenceType}
                setRecurrenceType={setRecurrenceType}
                recurrenceEndDate={recurrenceEndDate}
                setRecurrenceEndDate={setRecurrenceEndDate}
                shouldDisableDate={shouldDisableDate}
                aria-label="Tekrarlama Ayarları"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Users size={24} style={{ marginRight: "12px", color: "#4338CA" }} />
                <Typography component="h3" variant="h6" fontWeight={600} aria-label="Katılımcılar Alanı">
                  Katılımcılar
                </Typography>
              </Box>
              <AsyncUserSelectbox value={participants} onChange={setParticipants} />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleReservation}
                disabled={!selectedRoom || !startTime || !endTime || (enableRecurrence && !recurrenceEndDate)}
                fullWidth
                aria-label="Toplantıyı Planla"
                sx={{
                  py: 1.5,
                  borderRadius: "12px",
                  backgroundColor: "#4338CA",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#3730A3" },
                  "&:disabled": { backgroundColor: alpha("#4338CA", 0.4) },
                }}
              >
                Toplantı Planla
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Alerts */}
      {isSignedIn && user && <NextMeetingAlert userId={user.id} />}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            borderRadius: "12px",
            "& .MuiAlert-icon": { fontSize: "24px" },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
