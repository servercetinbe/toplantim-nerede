import React from "react";
import { formatReservationTime } from "@/utils/formatDate";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import TodayIcon from "@mui/icons-material/Today";
import WarningIcon from "@mui/icons-material/Warning";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { ReservationListProps } from "../types/ReservationListProps";

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
                    <Typography variant="h6" color="primary" component="h3" sx={{ fontWeight: "bold", flexGrow: 1 }}>
                      {reservation.room?.name || "Unknown Room"}
                    </Typography>
                    {isUsersOngoingMeeting && (
                      <Chip
                        icon={<MeetingRoomIcon />}
                        label="Toplantınız Başladı!"
                        color="error"
                        variant="filled"
                        aria-label="Toplantınız başladı: Lütfen toplantı odasına gidiniz"
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
                        aria-label="Toplantı şu anda devam ediyor"
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
                        aria-label="Bugün toplantınız var"
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
                        aria-label={`Toplantınız Aktif: ${reservation.room?.name || "Bilinmiyor"} odasına gidin.`}
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
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          //eslint-disable-next-line max-len
                          aria-label={`Toplantı Zamanı: ${formatReservationTime(reservation)}, Oda: ${reservation.room?.name || "Bilinmiyor"}`}
                        >
                          {formatReservationTime(reservation)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" marginBottom="4px">
                        <PersonIcon sx={{ marginRight: "8px", fontSize: "20px", color: "grey.600" }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          aria-label={`Toplantı Sahibi: ${reservation.user?.name || "Guest"}`}
                        >
                          Toplantı Sahibi: {reservation.user?.name || "Guest"}
                          {isUsersMeeting && (
                            <Chip
                              aria-label="Sizin Toplantınız"
                              label="Sizin Toplantınız"
                              size="small"
                              sx={{
                                ml: 1,
                                height: "20px",
                                backgroundColor: "#bbdefb",
                                color: "#0d47a1",
                                fontWeight: "bold",
                              }}
                            />
                          )}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" marginBottom="4px">
                        <PeopleIcon sx={{ marginRight: "8px", fontSize: "20px", color: "grey.600" }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          aria-label={`Toplantı Kapasitesi: ${reservation.room?.capacity || "N/A"}`}
                        >
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
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                              }}
                            >
                              {reservation.participants.map(participant => {
                                const displayName =
                                  participant.first_name && participant.last_name
                                    ? `${participant.first_name} ${participant.last_name}`
                                    : participant.first_name || participant.last_name || participant.id;

                                return (
                                  <Chip
                                    key={participant.id}
                                    label={displayName}
                                    size="small"
                                    sx={{
                                      backgroundColor: participant.id === currentUser ? "#e3f2fd" : "#e0ebff",
                                      color: participant.id === currentUser ? "#1976d2" : "#3f51b5",
                                    }}
                                    aria-label={
                                      participant.id === currentUser
                                        ? `${displayName} (Siz)`
                                        : `Katılımcı: ${displayName}`
                                    }
                                  />
                                );
                              })}
                            </Box>
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
