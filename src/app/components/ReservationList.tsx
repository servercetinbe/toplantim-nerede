import React from "react";
import { List, ListItem, ListItemText, Typography, Paper, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import { formatReservationTime } from "@/utils/formatDate";

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

interface ReservationListProps {
  reservations: Reservation[];
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations }) => (
  <List>
    {reservations.map((reservation) => (
      <Paper
        key={reservation.id}
        elevation={3}
        sx={{
          padding: "16px",
          marginBottom: "16px",
          borderRadius: "8px",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <ListItem alignItems="flex-start" disableGutters>
          <ListItemText
            primary={
              <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                {reservation.room?.name || "Unknown Room"}
              </Typography>
            }
            secondary={
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
                    {reservation.user?.name || "Guest"}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <PeopleIcon sx={{ marginRight: "8px", fontSize: "20px", color: "grey.600" }} />
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {reservation.room?.capacity || "N/A"}
                  </Typography>
                </Box>
              </Box>
            }
          />
        </ListItem>
      </Paper>
    ))}
  </List>
);

export default ReservationList;
