"use client";

import React, { useEffect, useState } from "react";
import { checkReservationConflict } from "@/utils/conflictCheck";
import { getReservationsFromStorage, saveReservationToStorage } from "@/utils/reservationStorage";
import { useUser } from "@clerk/nextjs";
import { Alert, alpha, Box, Button, Container, Grid, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

import "dayjs/locale/tr";

import Autocomplete from "@mui/material/Autocomplete";
import Popper from "@mui/material/Popper";
import updateLocale from "dayjs/plugin/updateLocale";
import { Building2, CalendarClock, Repeat, Users } from "lucide-react";

import CompanySelector from "../components/CompanySelector";
import NextMeetingAlert from "../components/NextMeetingAlert";
import RoomSelector from "../components/RoomSelector";

const CustomPopper = (props: React.ComponentProps<typeof Popper>) => (
  <Popper {...props} placement="bottom-start" modifiers={[{ name: "flip", enabled: false }]} />
);

dayjs.extend(updateLocale);
dayjs.updateLocale("tr", {
  weekStart: 1,
});

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface Reservation {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  roomId: string;
  room?: Room;
  user?: {
    id: string;
    name?: string;
    email: string;
  } | null;
  participants?: Array<{ id: string; name: string }>;
}

interface User {
  id: string;
  name: string;
}

const companies = [
  {
    name: "Puzzle",
    rooms: [
      { id: "puzzleA", name: "Puzzle A", capacity: 10 },
      { id: "passengerA", name: "Passenger A", capacity: 15 },
    ],
  },
  { name: "Passenger", rooms: [{ id: "passengerB", name: "Passenger B", capacity: 12 }] },
];

const officialHolidays = [
  "2024-01-01",
  "2024-04-23",
  "2024-05-01",
  "2024-05-19",
  "2024-07-15",
  "2024-08-30",
  "2024-10-29",
  "2025-01-01",
  "2025-04-23",
  "2025-05-01",
  "2025-05-19",
  "2025-03-29",
  "2025-03-30",
  "2025-03-31",
  "2025-04-01",
  "2025-06-30",
  "2025-07-01",
  "2025-07-02",
  "2025-07-03",
  "2025-07-04",
  "2025-07-15",
  "2025-08-30",
  "2025-10-29",
];

const HomePage = (): React.ReactElement => {
  const { user, isSignedIn } = useUser();
  const [meetingRooms, setMeetingRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [repeatCount, setRepeatCount] = useState<number>(1);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();

    const reservations = getReservationsFromStorage();
    reservations.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    setReservations(reservations);
  }, []);

  const shouldDisableDate = (date: unknown) => {
    const day = (date as Dayjs).day();
    const isWeekend = day === 0 || day === 6;
    const isHoliday = officialHolidays.includes((date as Dayjs).format("YYYY-MM-DD"));
    return isWeekend || isHoliday;
  };

  const handleStartTimeChange = (newValue: Dayjs | null) => {
    setStartTime(newValue);
    if (newValue) {
      setEndTime(newValue.add(1, "hour"));
    }
  };

  const handleRepeatCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0) {
      showSnackbar("Tekrar sayısı negatif olamaz. Lütfen pozitif bir sayı girin.", "error");
    } else {
      setRepeatCount(value);
    }
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

    const email = user?.primaryEmailAddress?.emailAddress || "guest@example.com";
    const name = user?.fullName || user?.username || email;

    const room = meetingRooms.find(r => r.id === selectedRoom);
    const selectedParticipants = users
      .filter(usr => participants.includes(usr.id))
      .map(usr => ({ id: usr.id, name: usr.name }));

    const newReservations: Reservation[] = [];

    for (let i = 0; i < repeatCount; i += 1) {
      const newStartTime = startTime?.add(i, "week");
      const newEndTime = endTime?.add(i, "week");

      if (newStartTime && newEndTime && (shouldDisableDate(newStartTime) || shouldDisableDate(newEndTime))) {
        showSnackbar(`Tatil veya hafta sonuna denk geldiği için ${newStartTime.format("YYYY-MM-DD")} atlandı`, "error");
        continue;
      }

      if (
        newStartTime &&
        newEndTime &&
        checkReservationConflict(newStartTime.toString(), newEndTime.toString(), selectedRoom)
      ) {
        showSnackbar(`Seçilen zaman dilimi mevcut bir rezervasyonla çakışıyor: ${i + 1}. tekrar`, "error");
        return;
      }

      const newReservation: Reservation = {
        id: String(new Date().getTime() + i),
        roomId: selectedRoom,
        startTime: newStartTime?.toString() || "",
        endTime: newEndTime?.toString() || "",
        room: room ? { id: room.id, name: room.name, capacity: room.capacity } : undefined,
        user: { id: user?.id || "guest", name, email },
        participants: selectedParticipants,
      };

      newReservations.push(newReservation);
    }

    if (newReservations.length === 0) {
      showSnackbar("Rezervasyon yapılamadı. Tüm tarih aralıkları tatil veya hafta sonuna denk geliyor.", "error");
      return;
    }

    newReservations.forEach(reservation => saveReservationToStorage(reservation));
    showSnackbar("Rezervasyon başarıyla yapıldı", "success");

    const updatedReservations = [...reservations, ...newReservations];
    updatedReservations.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    setReservations(updatedReservations);

    setStartTime(null);
    setEndTime(null);
    setParticipants([]);
    setRepeatCount(1);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

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
            variant="h3"
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
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Building2 size={24} style={{ marginRight: "12px", color: "#4338CA" }} />
                <Typography variant="h6" fontWeight={600}>
                  Firma ve Oda Seçimi
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CompanySelector
                    companies={companies}
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                    setMeetingRooms={setMeetingRooms}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RoomSelector
                    meetingRooms={meetingRooms}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarClock size={24} style={{ marginRight: "12px", color: "#4338CA" }} />
                <Typography variant="h6" fontWeight={600}>
                  Zaman Seçimi
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                    <DesktopDateTimePicker
                      label="Başlangıç Zamanı"
                      value={startTime}
                      onChange={value => handleStartTimeChange(value as Dayjs | null)}
                      shouldDisableDate={shouldDisableDate}
                      renderInput={params => (
                        <TextField
                          {...params}
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                    <DesktopDateTimePicker
                      label="Bitiş Zamanı"
                      value={endTime}
                      onChange={newValue => setEndTime(newValue as Dayjs | null)}
                      shouldDisableDate={shouldDisableDate}
                      renderInput={params => (
                        <TextField
                          {...params}
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Repeat size={24} style={{ marginRight: "12px", color: "#4338CA" }} />
                <Typography variant="h6" fontWeight={600}>
                  Tekrar Ayarları
                </Typography>
              </Box>
              <TextField
                label="Tekrar Sayısı"
                type="number"
                value={repeatCount}
                onChange={handleRepeatCountChange}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Users size={24} style={{ marginRight: "12px", color: "#4338CA" }} />
                <Typography variant="h6" fontWeight={600}>
                  Katılımcılar
                </Typography>
              </Box>
              <Autocomplete
                multiple
                options={users}
                getOptionLabel={option => option.name}
                value={users.filter(user => participants.includes(user.id))}
                onChange={(event, newValue) => setParticipants(newValue.map(user => user.id))}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Katılımcıları Seç"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                )}
                PopperComponent={CustomPopper}
                sx={{
                  "& .MuiChip-root": {
                    borderRadius: "8px",
                    backgroundColor: alpha("#4338CA", 0.1),
                    color: "#4338CA",
                    "& .MuiChip-deleteIcon": {
                      color: "#4338CA",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleReservation}
              disabled={!selectedRoom || !startTime || !endTime}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: "12px",
                backgroundColor: "#4338CA",
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#3730A3",
                },
                "&:disabled": {
                  backgroundColor: alpha("#4338CA", 0.4),
                },
              }}
            >
              Toplantı Planla
            </Button>
          </Box>
        </Paper>
      </Container>

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
            "& .MuiAlert-icon": {
              fontSize: "24px",
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
