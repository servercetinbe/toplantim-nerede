"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Grid, Button, Snackbar, Alert, Box, TextField, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import CompanySelector from "../components/CompanySelector";
import RoomSelector from "../components/RoomSelector";
import ReservationList from "../components/ReservationList";
import { getReservationsFromStorage, saveReservationToStorage } from "@/utils/reservationStorage";
import { checkReservationConflict } from "@/utils/conflictCheck";

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
  { name: "Puzzle", rooms: [{ id: "puzzleA", name: "Puzzle A", capacity: 10 }, { id: "passengerA", name: "Passenger A", capacity: 15 }] },
  { name: "Passenger", rooms: [{ id: "passengerB", name: "Passenger B", capacity: 12 }] },
];

const HomePage = () => {
  const { user, isSignedIn } = useUser();
  const [meetingRooms, setMeetingRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Clerk kullanıcıları
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

  const handleReservation = () => {
    if (!selectedRoom || !startTime || !endTime) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    if (!isSignedIn) {
      showSnackbar("You need to be signed in to make a reservation", "error");
      return;
    }

    if (checkReservationConflict(startTime, endTime, selectedRoom)) {
      showSnackbar("Selected time conflicts with an existing reservation", "error");
      return;
    }

    const email = user?.primaryEmailAddress?.emailAddress || "guest@example.com";
    const name = user?.fullName || user?.username || email;

    const room = meetingRooms.find(r => r.id === selectedRoom);

    const selectedParticipants = users
      .filter((usr) => participants.includes(usr.id))
      .map((usr) => ({ id: usr.id, name: usr.name }));

    const newReservation: Reservation = {
      id: String(new Date().getTime()),
      roomId: selectedRoom,
      startTime,
      endTime,
      room: room ? { id: room.id, name: room.name, capacity: room.capacity } : undefined,
      user: { id: user?.id || "guest", name, email },
      participants: selectedParticipants,
    };

    saveReservationToStorage(newReservation);
    showSnackbar("Reservation successful", "success");

    const updatedReservations = [...reservations, newReservation];
    updatedReservations.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    setReservations(updatedReservations);

    setStartTime("");
    setEndTime("");
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
        <Typography variant="h3" gutterBottom>Meeting Room Booking</Typography>
      </Box>

      <Paper elevation={3} style={{ padding: "30px", marginBottom: "20px" }}>
        <Typography variant="h5" gutterBottom>Select Company</Typography>
        <CompanySelector
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          setMeetingRooms={setMeetingRooms}
        />
      </Paper>

      <Paper elevation={3} style={{ padding: "30px", marginBottom: "20px" }}>
        <Typography variant="h5" gutterBottom>Select Meeting Room</Typography>
        <RoomSelector meetingRooms={meetingRooms} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
      </Paper>

      <Paper elevation={3} style={{ padding: "30px", marginBottom: "20px" }}>
        <Typography variant="h5" gutterBottom>Schedule Time</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Time"
              type="datetime-local"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Time"
              type="datetime-local"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} style={{ padding: "30px", marginBottom: "20px" }}>
        <Typography variant="h5" gutterBottom>Select Participants</Typography>
        <FormControl fullWidth>
          <Select
            multiple
            value={participants}
            onChange={(event) => setParticipants(event.target.value as string[])}
            renderValue={(selected) => selected.map((id) => users.find((user) => user.id === id)?.name).join(", ")}
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
        Schedule Meeting
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
