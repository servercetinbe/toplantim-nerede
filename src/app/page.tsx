"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { MeetingRoom } from "@prisma/client";
import { useTranslations } from "next-intl";

// Mock API to get available rooms - you will replace it with a real API call.
const fetchMeetingRooms = async () => {
  const response = await fetch("/api/meetingRooms");
  return response.json();
};
const companies = [
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
  const t = useTranslations();
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");

  const handleCompanyChange = (event: SelectChangeEvent<string>) => {
    const selectedCompany = companies.find(c => c.name === event.target.value);
    setSelectedCompany(selectedCompany?.name || "");
    setMeetingRooms(selectedCompany?.rooms || []);
  };

  useEffect(() => {
    fetchMeetingRooms().then(setMeetingRooms).catch(console.error);
  }, []);

  const handleReservation = async () => {
    if (!selectedRoom || !startTime || !endTime) {
      alert("Please select room and time.");
      return;
    }

    const reservationData = {
      roomId: selectedRoom,
      startTime,
      endTime,
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
      } else {
        const errorData = await response.json();
        alert(`Failed to make reservation: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Reservation error:", error);
      alert("Failed to make reservation");
    }
  };

  return (
    <Container maxWidth="md" style={{ padding: "30px", backgroundColor: "#f9f9f9" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom>
          {t("title")}
        </Typography>
      </Box>

      {/* Firma Seçimi */}
      <Paper elevation={3} style={{ padding: "30px", marginBottom: "40px" }}>
        <Typography variant="h5">Firma Seçin</Typography>
        <Select fullWidth value={selectedCompany} onChange={handleCompanyChange} displayEmpty>
          <MenuItem value="" disabled>
            Firma Seçin
          </MenuItem>
          {companies.map(company => (
            <MenuItem key={company.name} value={company.name}>
              {company.name}
            </MenuItem>
          ))}
        </Select>
      </Paper>

      {/* Toplantı Odası Seçimi */}
      <Paper elevation={3} style={{ padding: "30px", marginBottom: "40px" }}>
        <Typography variant="h5">Toplantı Odası Seçin</Typography>
        <Select fullWidth value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} displayEmpty>
          <MenuItem value="" disabled>
            Oda Seçin
          </MenuItem>
          {meetingRooms.map(room => (
            <MenuItem key={room.id} value={room.id}>
              {room.name} - Capacity: {room.capacity}
            </MenuItem>
          ))}
        </Select>
      </Paper>

      {/* Tarih ve Saat Seçimi */}
      <Paper elevation={3} style={{ padding: "30px" }}>
        <Typography variant="h5">{t("scheduler.title")}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("scheduler.startTime")}
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
              label={t("scheduler.endTime")}
              type="datetime-local"
              fullWidth
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="secondary" size="large" fullWidth onClick={handleReservation}>
              {t("scheduler.scheduleTime")}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;
