"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getReservationsFromStorage } from "@/utils/reservationStorage";
import { useUser } from "@clerk/nextjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import NextMeetingAlert from "../components/NextMeetingAlert";
import ReservationList from "../components/ReservationList";
import { Reservation } from "../types/Reservation";

const MyReservationsPage: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const allReservations = getReservationsFromStorage();
      const currentTime = new Date().getTime();

      const userReservations = allReservations.filter(
        reservation =>
          (reservation.user?.id === user.id || reservation.participants?.some(p => p.id === user.id)) &&
          new Date(reservation.endTime).getTime() > currentTime
      );

      setMyReservations(userReservations);
    }
  }, [user]);

  const allRooms = useMemo(() => {
    const rooms = Array.from(new Set(myReservations.map(reservation => reservation.room?.name || "")));
    return rooms.sort();
  }, [myReservations]);

  const filteredReservations = useMemo(
    () =>
      myReservations.filter(reservation => {
        const isSelectedRoom = selectedRooms.length === 0 || selectedRooms.includes(reservation.room?.name || "");
        const isActive = new Date(reservation.endTime).getTime() > Date.now();
        return isSelectedRoom && isActive;
      }),
    [myReservations, selectedRooms]
  );

  const handleRoomSelection = (room: string) => {
    setSelectedRooms(prevSelectedRooms =>
      prevSelectedRooms.includes(room) ? prevSelectedRooms.filter(r => r !== room) : [...prevSelectedRooms, room]
    );
  };

  const handleClearFilters = () => {
    setSelectedRooms([]);
  };

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
              aria-label="Toplantılarım"
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
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              aria-label="Odaya Göre Filtreleme"
              sx={{ fontWeight: "600", color: "#3f51b5", textAlign: "center" }}
            >
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
                      aria-label={`${room} odasını seç veya çıkar`}
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
                <Button
                  variant="outlined"
                  color="primary"
                  aria-label="Seçili filtreleri temizle"
                  onClick={handleClearFilters}
                >
                  Filtreleri Temizle
                </Button>
              </Box>
            )}
          </Box>

          {filteredReservations.length > 0 ? (
            <ReservationList reservations={filteredReservations} currentUser={user?.id} />
          ) : (
            <Box textAlign="center" sx={{ mt: 4, p: 2, backgroundColor: "#fff3cd", borderRadius: "8px" }}>
              <Typography variant="h6" aria-label="Henüz Toplantınız Bulunmamaktadır" color="#856404">
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
