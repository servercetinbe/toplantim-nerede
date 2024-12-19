"use client";

import React, { useEffect, useState } from "react";
import { getReservationsFromStorage } from "@/utils/reservationStorage";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from "@mui/material";

import NextMeetingAlert from "../components/NextMeetingAlert";
import ReservationList from "../components/ReservationList";
import { Reservation } from "../types/Reservation";

const MyReservationsPage: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [allRooms, setAllRooms] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const allReservations = getReservationsFromStorage();
      allReservations.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

      const currentTime = new Date().getTime();

      const userReservations = allReservations.filter(
        reservation =>
          (reservation.user?.id === user.id || reservation.participants?.some(p => p.id === user.id)) &&
          new Date(reservation.endTime).getTime() > currentTime
      );

      setMyReservations(userReservations);

      const rooms = Array.from(new Set(userReservations.map(reservation => reservation.room?.name || "")));
      rooms.sort();
      setAllRooms(rooms);
    }
  }, [user]);

  const handleRoomSelection = (room: string) => {
    setSelectedRooms(prevSelectedRooms =>
      prevSelectedRooms.includes(room) ? prevSelectedRooms.filter(r => r !== room) : [...prevSelectedRooms, room]
    );
  };

  const handleClearFilters = () => {
    setSelectedRooms([]);
  };

  const myBookedReservations = myReservations.filter(
    reservation =>
      selectedRooms.includes(reservation.room?.name || "") && new Date(reservation.endTime).getTime() > Date.now()
  );
  const allReservations = myReservations.filter(reservation => new Date(reservation.endTime).getTime() > Date.now());

  const filteredReservations = selectedRooms.length > 0 ? myBookedReservations : allReservations;

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={4}
          sx={{ p: 4, borderRadius: "16px", backgroundColor: "#f9fbff", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
        >
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#3f51b5",
                fontSize: { xs: "1.75rem", sm: "2.5rem" },
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Toplantılarım
            </Typography>
            <Divider sx={{ bgcolor: "primary.main", height: 2, width: "50%", mx: "auto", mb: 3 }} />
          </Box>
          {isSignedIn && user && <NextMeetingAlert userId={user.id} />}

          {/* Room Filtering */}
          <Box
            sx={{
              mb: 4,
              p: 3,
              borderRadius: "12px",
              backgroundColor: "#e0ebff",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "600", color: "#3f51b5", textAlign: "center" }}>
              Odaya Göre Filtreleme
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormGroup row sx={{ justifyContent: "center", gap: 2 }}>
              {allRooms.map(room => (
                <FormControlLabel
                  key={room}
                  control={
                    <Checkbox
                      checked={selectedRooms.includes(room)}
                      onChange={() => handleRoomSelection(room)}
                      name={room}
                      sx={{ color: "#3f51b5" }}
                    />
                  }
                  label={room}
                  sx={{
                    mb: 1,
                    "& .MuiFormControlLabel-label": {
                      fontWeight: "500",
                      color: "#3f51b5",
                    },
                    transition: "all 0.3s",
                    "&:hover": {
                      backgroundColor: "#d0d9ff",
                      borderRadius: "8px",
                    },
                  }}
                />
              ))}
            </FormGroup>
            {selectedRooms.length > 0 && (
              <Box textAlign="center" mt={2}>
                <Button variant="outlined" color="primary" onClick={handleClearFilters}>
                  Filtreleri Temizle
                </Button>
              </Box>
            )}
          </Box>

          {filteredReservations.length > 0 ? (
            <ReservationList reservations={filteredReservations} currentUser={user?.id} />
          ) : (
            <Box textAlign="center" sx={{ mt: 4, p: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Henüz herhangi bir toplantınız bulunmamaktadır.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default MyReservationsPage;
