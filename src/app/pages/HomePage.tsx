"use client";

import React, { useEffect, useState } from "react";
import { checkReservationConflict } from "@/utils/conflictCheck";
import { getReservationsFromStorage, saveReservationToStorage } from "@/utils/reservationStorage";
import { useUser } from "@clerk/nextjs";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  Grid,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/tr";
import updateLocale from "dayjs/plugin/updateLocale";
import CompanySelector from "../components/CompanySelector";
import ReservationList from "../components/ReservationList";
import RoomSelector from "../components/RoomSelector";

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
    setReservations(reservations);
  }, []);

  const shouldDisableDate = (date: Dayjs) => {
    const day = date.day();
    const isWeekend = day === 0 || day === 6;
    const isHoliday = officialHolidays.includes(date.format("YYYY-MM-DD"));

    return isWeekend || isHoliday;
  };

  const handleStartTimeChange = (newValue: Dayjs | null) => {
    setStartTime(newValue);
    if (newValue) {
      setEndTime(newValue.add(1, "hour"));
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

    if (checkReservationConflict(startTime.toString(), endTime.toString(), selectedRoom)) {
      showSnackbar("Seçilen zaman dilimi mevcut bir rezervasyonla çakışıyor", "error");
      return;
    }

    const email = user?.primaryEmailAddress?.emailAddress || "guest@example.com";
    const name = user?.fullName || user?.username || email;

    const room = meetingRooms.find((r) => r.id === selectedRoom);

    const selectedParticipants = users
      .filter((usr) => participants.includes(usr.id))
      .map((usr) => ({ id: usr.id, name: usr.name }));

    const newReservation: Reservation = {
      id: String(new Date().getTime()),
      roomId: selectedRoom,
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      room: room ? { id: room.id, name: room.name, capacity: room.capacity } : undefined,
      user: { id: user?.id || "guest", name, email },
      participants: selectedParticipants,
    };

    saveReservationToStorage(newReservation);
    showSnackbar("Rezervasyon başarıyla yapıldı", "success");

    const updatedReservations = [...reservations, newReservation];
    updatedReservations.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    setReservations(updatedReservations);

    setStartTime(null);
    setEndTime(null);
    setParticipants([]);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Container maxWidth="md" style={{ padding: "30px" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom>
          Toplantı Odası Rezervasyonu
        </Typography>
      </Box>

      <Paper elevation={5} sx={{ padding: "30px", marginBottom: "30px", borderRadius: "16px" }}>
        <Typography variant="h5" gutterBottom>
          Firma Seç
        </Typography>
        <CompanySelector
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          setMeetingRooms={setMeetingRooms}
        />
      </Paper>

      <Paper elevation={5} sx={{ padding: "30px", marginBottom: "30px", borderRadius: "16px" }}>
        <Typography variant="h5" gutterBottom>
          Toplantı Odası Seç
        </Typography>
        <RoomSelector meetingRooms={meetingRooms} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
      </Paper>

      <Paper elevation={5} sx={{ padding: "30px", marginBottom: "30px", borderRadius: "16px" }}>
        <Typography variant="h5" gutterBottom>
          Zaman Planla
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DesktopDateTimePicker
                label="Başlangıç Zamanı"
                value={startTime}
                onChange={handleStartTimeChange}
                shouldDisableDate={shouldDisableDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DesktopDateTimePicker
                label="Bitiş Zamanı"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                shouldDisableDate={shouldDisableDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>

      <Paper elevation={5} sx={{ padding: "30px", marginBottom: "30px", borderRadius: "16px" }}>
        <Typography variant="h5" gutterBottom>
          Katılımcıları Seç
        </Typography>
        <FormControl fullWidth>
          <Select
            multiple
            value={participants}
            onChange={(event) => setParticipants(event.target.value as string[])}
            renderValue={(selected) =>
              selected.map((id) => users.find((user) => user.id === id)?.name).join(", ")
            }
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Checkbox checked={participants.indexOf(user.id) > -1} />
                <ListItemText primary={user.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={handleReservation}
        disabled={!selectedRoom || !startTime || !endTime}
        sx={{ marginBottom: "20px" }}
      >
        Toplantı Planla
      </Button>

      <ReservationList reservations={reservations} />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage;
