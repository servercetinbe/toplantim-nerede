"use client";

import React, { useEffect, useState } from "react";
import { getReservationsFromStorage, Reservation } from "@/utils/reservationStorage";
import { Dialog, DialogContent, DialogTitle, IconButton, Paper, Typography } from "@mui/material";
import { Bell, BellRing } from "lucide-react";

import "../styles/animations.css";
import "../styles/shakeStyles.css";

const NextMeetingAlert = ({ userId }: { userId: string }): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<Reservation | null>(null);
  const [nextMeeting, setNextMeeting] = useState<Reservation | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateMeetings = () => {
      const now = new Date();
      const allReservations = getReservationsFromStorage();

      const userMeetings = allReservations.filter(
        reservation => reservation.user?.id === userId || reservation.participants?.some(p => p.id === userId)
      );

      const ongoingMeeting = userMeetings.find(
        meeting => new Date(meeting.startTime) <= now && new Date(meeting.endTime) > now
      );

      const upcomingMeetings = userMeetings
        .filter(meeting => new Date(meeting.startTime) > now)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

      setCurrentMeeting(ongoingMeeting || null);
      setNextMeeting(ongoingMeeting ? null : upcomingMeetings[0]);
    };

    updateMeetings();
    const interval = setInterval(updateMeetings, 60000);

    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (!nextMeeting) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const meetingTime = new Date(nextMeeting.startTime).getTime();
      const difference = meetingTime - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [nextMeeting]);

  if (!currentMeeting && !nextMeeting) return null;

  return (
    <>
      <IconButton
        onClick={() => setIsOpen(true)}
        className={currentMeeting ? "shake" : "pulse"}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1301,
          backgroundColor: currentMeeting ? "#DC2626" : "#4338CA",
          color: "white",
          "&:hover": {
            backgroundColor: currentMeeting ? "#B91C1C" : "#3730A3",
          },
          width: 56,
          height: 56,
        }}
      >
        <Bell size={24} />
      </IconButton>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "16px",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
          <BellRing
            size={32}
            style={{
              color: currentMeeting ? "#DC2626" : "#4338CA",
              marginBottom: "8px",
            }}
          />
          <Typography variant="h5" fontWeight="bold" color="primary">
            {currentMeeting ? "Toplantınız Başladı" : "Sıradaki Toplantınız"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mt: 2,
              backgroundColor: "#F3F4F6",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            {currentMeeting ? (
              <>
                <Typography variant="h6" sx={{ color: "#DC2626", fontWeight: "bold", mb: 2 }}>
                  {new Date(currentMeeting.startTime).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(currentMeeting.endTime).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Toplantı Sahibi
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                  {currentMeeting.user?.name || "Bilinmiyor"}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Toplantı Odası
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                  {currentMeeting.room?.name || "Bilinmiyor"}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Katılımcılar
                </Typography>
                {(currentMeeting.participants ?? []).length > 0 ? (
                  currentMeeting.participants?.map(participant => (
                    <Typography key={participant.id} variant="body1" color="text.primary">
                      {participant.name}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Katılımcı yok
                  </Typography>
                )}
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ color: "#4338CA", fontWeight: "bold", mb: 2 }}>
                  {timeLeft.days} Gün {timeLeft.hours} Saat {timeLeft.minutes} Dakika {timeLeft.seconds} Saniye
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Toplantı Sahibi
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                  {nextMeeting?.user?.name || "Bilinmiyor"}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Toplantı Odası
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                  {nextMeeting?.room?.name || "Bilinmiyor"}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Katılımcılar
                </Typography>
                {(nextMeeting?.participants?.length ?? 0) > 0 ? (
                  nextMeeting?.participants?.map(participant => (
                    <Typography key={participant.id} variant="body1" color="text.primary">
                      {participant.name}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Katılımcı yok
                  </Typography>
                )}
              </>
            )}
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NextMeetingAlert;
