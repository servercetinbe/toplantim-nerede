import React from "react";
import { formatReservationTime } from "@/utils/formatDate";
import { Reservation } from "@/utils/reservationStorage";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import TodayIcon from "@mui/icons-material/Today";
import WarningIcon from "@mui/icons-material/Warning";
import { Alert, Box, Chip, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";

interface ReservationListProps {
  reservations: Reservation[];
  currentUser: string | undefined;
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations, currentUser }) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = (date: Date) => date >= today && date < tomorrow;

  return (
    <List>
      {reservations.map(reservation => {
        const startTime = new Date(reservation.startTime);
        const endTime = new Date(reservation.endTime);
        const isTodaysMeeting = isToday(startTime);

        const isUsersMeeting = reservation.user?.id === currentUser;
        const isCurrentUserParticipant =
          isUsersMeeting || reservation.participants?.some(participant => participant.id === currentUser);
        const isOngoingMeeting = now >= startTime && now <= endTime;
        const isUsersOngoingMeeting = isUsersMeeting && isOngoingMeeting;
        const isUsersTodayMeeting = isTodaysMeeting && isCurrentUserParticipant;

        const borderColor = (() => {
          if (isUsersOngoingMeeting) return "3px solid #f44336";
          if (isOngoingMeeting && isCurrentUserParticipant) return "2px solid #f44336";
          if (isUsersTodayMeeting) return "2px solid #2196f3";
          return "none";
        })();

        const getBackgroundColor = () => {
          if (isUsersOngoingMeeting) return "#fff3f0";
          if (isUsersTodayMeeting) return "#f3f8ff";
          return "#ffffff";
        };

        const backgroundColor = getBackgroundColor();

        return (
          <Paper
            key={reservation.id}
            elevation={3}
            sx={{
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "8px",
              transition: "transform 0.2s, box-shadow 0.2s",
              border: borderColor,
              backgroundColor,
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <ListItem alignItems="flex-start" disableGutters>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: "bold", flexGrow: 1 }}>
                      {reservation.room?.name || "Unknown Room"}
                    </Typography>
                    {isUsersOngoingMeeting && (
                      <Chip
                        icon={<MeetingRoomIcon />}
                        label="Toplantınız Başladı!"
                        color="error"
                        variant="filled"
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": { transform: "scale(1)" },
                            "50%": { transform: "scale(1.05)" },
                            "100%": { transform: "scale(1)" },
                          },
                        }}
                      />
                    )}
                    {isOngoingMeeting && !isUsersOngoingMeeting && isCurrentUserParticipant && (
                      <Chip
                        icon={<WarningIcon />}
                        label="Toplantı Devam Ediyor"
                        color="error"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    )}
                    {isUsersTodayMeeting && !isOngoingMeeting && (
                      <Chip
                        icon={<TodayIcon />}
                        label="Bugün"
                        color="primary"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    {isUsersOngoingMeeting && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: 1,
                          mb: 2,
                          animation: "fadeIn 0.5s",
                          "@keyframes fadeIn": {
                            "0%": { opacity: 0, transform: "translateY(-10px)" },
                            "100%": { opacity: 1, transform: "translateY(0)" },
                          },
                        }}
                      >
                        Toplantınız şu anda aktif durumda! Lütfen toplantı odasına gidiniz.
                      </Alert>
                    )}
                    <Box sx={{ marginTop: "8px" }}>
                      <Box display="flex" alignItems="center" marginBottom="4px">
                        <AccessTimeIcon sx={{ marginRight: "8px", fontSize: "20px", color: "grey.600" }} />
                        <Typography variant="body1" color="text.secondary">
                          {formatReservationTime(reservation)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" marginBottom="4px">
                        <PersonIcon sx={{ marginRight: "8px", fontSize: "20px", color: "grey.600" }} />
                        <Typography variant="body2" color="text.secondary">
                          Toplantı Sahibi: {reservation.user?.name || "Guest"}
                          {isUsersMeeting && (
                            <Chip
                              label="Sizin Toplantınız"
                              size="small"
                              sx={{
                                ml: 1,
                                height: "20px",
                                backgroundColor: "#e3f2fd",
                                color: "#1976d2",
                                fontWeight: "bold",
                              }}
                            />
                          )}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" marginBottom="4px">
                        <PeopleIcon sx={{ marginRight: "8px", fontSize: "20px", color: "grey.600" }} />
                        <Typography variant="body2" color="text.secondary">
                          Kapasite: {reservation.room?.capacity || "N/A"}
                        </Typography>
                      </Box>
                      {reservation.participants && reservation.participants.length > 0 && (
                        <Box display="flex" alignItems="flex-start" marginTop="8px">
                          <GroupIcon
                            sx={{ marginRight: "8px", fontSize: "20px", color: "grey.600", marginTop: "4px" }}
                          />
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "4px" }}>
                              Katılımcılar:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              {reservation.participants.map(participant => (
                                <Chip
                                  key={participant.id}
                                  label={participant.name}
                                  size="small"
                                  sx={{
                                    backgroundColor: participant.id === currentUser ? "#e3f2fd" : "#e0ebff",
                                    color: participant.id === currentUser ? "#1976d2" : "#3f51b5",
                                    fontWeight: participant.id === currentUser ? "bold" : "normal",
                                    marginBottom: "4px",
                                    "&:hover": {
                                      backgroundColor: participant.id === currentUser ? "#bbdefb" : "#d0d9ff",
                                    },
                                  }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </>
                }
              />
            </ListItem>
          </Paper>
        );
      })}
    </List>
  );
};

export default ReservationList;
