"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk'ten oturum açmış kullanıcıyı almak için kullanıyoruz
import {
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
  TextField,
  Typography,
} from "@mui/material";

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface Company {
  name: string;
  rooms: Room[];
}

interface User {
  id: string;
  email: string;
}

interface Reservation {
  id: string;
  date: string;
  time: string;
  roomId: string;
  userId: string;
  room: Room;
  user: User | null;
}

const companies: Company[] = [
  {
    name: "Puzzle",
    rooms: [
      { id: "puzzleA", name: "Puzzle A", capacity: 10 },
      { id: "passengerA", name: "Passenger A", capacity: 10 },
    ],
  },
  {
    name: "Passenger",
    rooms: [{ id: "passengerB", name: "Passenger B", capacity: 10 }],
  },
];

const Home = (): React.ReactElement => {
  const { user } = useUser(); // Oturum açmış kullanıcıyı almak için Clerk'ten hook kullanıyoruz
  const [meetingRooms, setMeetingRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Fetch meeting rooms and reservations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsResponse, reservationsResponse] = await Promise.all([
          fetch("/api/meetingRooms"),
          fetch("/api/reservationList"),
        ]);

        const rooms = await roomsResponse.json();
        const reservationsData = await reservationsResponse.json();

        setMeetingRooms(rooms);
        setReservations(reservationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCompanyChange = (event: SelectChangeEvent<string>) => {
    const company = companies.find(c => c.name === event.target.value);
    setSelectedCompany(company?.name || "");
    setMeetingRooms(company?.rooms || []);
    setSelectedRoom(""); // Reset room selection when company changes
  };

  const handleReservation = async () => {
    if (!selectedRoom || !startTime || !endTime) {
      alert("Please fill in all required fields");
      return;
    }

    const reservationData = {
      roomId: selectedRoom,
      startTime,
      endTime,
      userId: user?.id, // Oturum açmış kullanıcının ID'sini gönderiyoruz
    };

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        alert("Reservation successful");
        // Refresh reservations list
        const updatedReservations = await fetch("/api/reservationList").then(res => res.json());
        setReservations(updatedReservations);

        // Reset form
        setStartTime("");
        setEndTime("");
      } else {
        const errorData = await response.json();
        alert(`Reservation failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Reservation error:", error);
      alert("Failed to make reservation");
    }
  };

  const formatReservationTime = (reservation: Reservation) => {
    const date = new Date(reservation.date).toLocaleDateString();
    return `${date} ${reservation.time}`;
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
            <ListItem key={reservation.id}>
              <ListItemText
                primary={`Room: ${reservation.room?.name || "Unknown Room"}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      Time: {formatReservationTime(reservation)}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textSecondary">
                      {reservation.user ? `Reserved by: ${reservation.user.email}` : "User information not available"}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Home;
