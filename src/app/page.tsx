"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { getReservationsFromStorage, saveReservationToStorage } from "../utils/reservationStorage";
import { formatReservationTime } from "../utils/formatDate";
import { checkReservationConflict } from "../utils/conflictCheck";

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
  room?: {
    id: string;
    name: string;
    capacity: number;
  };
  user?: {
    id: string;
    name?: string;
    email: string;
  } | null;
}

const companies = [
  {
    name: "Puzzle",
    rooms: [
      { id: "puzzleA", name: "Puzzle A", capacity: 10 },
      { id: "passengerA", name: "Passenger A", capacity: 15 },
    ],
  },
  {
    name: "Passenger",
    rooms: [{ id: "passengerB", name: "Passenger B", capacity: 12 }],
  },
];

const Home = (): React.ReactElement => {
  const { user, isSignedIn } = useUser(); // Clerk ile kimlik doğrulama
  const [meetingRooms, setMeetingRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Helper function to show messages via Snackbar
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Close Snackbar
  const handleCloseSnackbar = () => setOpenSnackbar(false);

  // Fetch meeting rooms and reservations on component mount
  useEffect(() => {
    const rooms = [
      { id: "puzzleA", name: "Puzzle A", capacity: 10 },
      { id: "passengerA", name: "Passenger A", capacity: 15 },
      { id: "passengerB", name: "Passenger B", capacity: 12 },
    ];

    const reservations = getReservationsFromStorage();
    setMeetingRooms(rooms);
    setReservations(reservations);
  }, []);

  // Handle company selection
  const handleCompanyChange = (event: SelectChangeEvent<string>) => {
    const company = companies.find(c => c.name === event.target.value);
    setSelectedCompany(company?.name || "");
    setMeetingRooms(company?.rooms || []);
    setSelectedRoom("");
  };

  // handleReservation fonksiyonunda çakışma kontrolünü uygulama
  const handleReservation = async () => {
    if (!selectedRoom || !startTime || !endTime) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    if (!isSignedIn) {
      showSnackbar("You need to be signed in to make a reservation", "error");
      return;
    }

    // Çakışma kontrolü
    if (checkReservationConflict(startTime, endTime, selectedRoom)) {
      showSnackbar("Selected time conflicts with an existing reservation", "error");
      return;
    }

    const email = user?.primaryEmailAddress?.emailAddress || "guest@example.com";
    const name = user?.fullName || user?.username || email;

    // Oda bilgilerini alın
    const room = meetingRooms.find(r => r.id === selectedRoom);

    const newReservation: Reservation = {
      id: String(new Date().getTime()),
      roomId: selectedRoom,
      startTime,
      endTime,
      room: room ? { id: room.id, name: room.name, capacity: room.capacity } : undefined,
      user: { id: user?.id || "guest", name, email },
    };

    // LocalStorage'a yeni rezervasyonu kaydet
    saveReservationToStorage(newReservation);

    showSnackbar("Reservation successful", "success");

    // Güncellenmiş rezervasyon listesini al
    const updatedReservations = getReservationsFromStorage();
    setReservations(updatedReservations);

    setStartTime("");
    setEndTime("");
  };

  return (
    <Container maxWidth="md" style={{ padding: "30px", backgroundColor: "#f9f9f9" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom>
          Meeting Room Booking
        </Typography>
      </Box>

      <Paper elevation={3} style={{ padding: "30px", marginBottom: "40px" }}>
        <Typography variant="h5" gutterBottom>
          Select Company
        </Typography>
        <Select fullWidth value={selectedCompany} onChange={handleCompanyChange} displayEmpty>
          <MenuItem value="" disabled>
            Select Company
          </MenuItem>
          {companies.map(company => (
            <MenuItem key={company.name} value={company.name}>
              {company.name}
            </MenuItem>
          ))}
        </Select>
      </Paper>

      <Paper elevation={3} style={{ padding: "30px", marginBottom: "40px" }}>
        <Typography variant="h5" gutterBottom>
          Select Meeting Room
        </Typography>
        <Select
          fullWidth
          value={selectedRoom}
          onChange={e => setSelectedRoom(e.target.value)}
          displayEmpty
          disabled={!selectedCompany}
        >
          <MenuItem value="" disabled>
            Select Room
          </MenuItem>
          {meetingRooms.map(room => (
            <MenuItem key={room.id} value={room.id}>
              {room.name} - Capacity: {room.capacity}
            </MenuItem>
          ))}
        </Select>
      </Paper>

      <Paper elevation={3} style={{ padding: "30px" }}>
        <Typography variant="h5" gutterBottom>
          Schedule Time
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Time"
              type="datetime-local"
              fullWidth
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Time"
              type="datetime-local"
              fullWidth
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleReservation}
              disabled={!selectedRoom || !startTime || !endTime}
            >
              Schedule Meeting
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} style={{ padding: "30px", marginTop: "40px" }}>
        <Typography variant="h5" gutterBottom>
          Current Reservations
        </Typography>
        <List>
          {reservations.map(reservation => (
            <ListItem
              key={reservation.id}
              alignItems="flex-start"
              sx={{
                mb: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography component="div" variant="h6" color="primary" sx={{ mb: 1 }}>
                    {reservation.room?.name || "Unknown Room"}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="div"
                      variant="body1"
                      color="text.primary"
                      sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                    >
                      <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                      {formatReservationTime(reservation)}
                    </Typography>

                    <Typography
                      component="div"
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                      {reservation.user
                        ? `${reservation.user.name || reservation.user.email}`
                        : "User information not available"}
                    </Typography>

                    <Typography
                      component="div"
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                    >
                      <PeopleIcon sx={{ mr: 1, fontSize: 20 }} />
                      Capacity: {reservation.room?.capacity || "N/A"}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

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

export default Home;
