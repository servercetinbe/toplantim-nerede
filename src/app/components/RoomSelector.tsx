import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import { RoomSelectorProps } from "../types/RoomSelectorProps";

const RoomSelector: React.FC<RoomSelectorProps> = ({ meetingRooms, selectedRoom, setSelectedRoom }) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="room-select-label">Toplantı Odası Seç</InputLabel>
      <Select
        labelId="room-select-label"
        value={selectedRoom}
        onChange={handleChange}
        label="Toplantı Odası Seç"
        aria-label="Toplantı Odası Seç"
        sx={{
          borderRadius: "12px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.23)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.87)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4338CA",
          },
        }}
      >
        <MenuItem value="" disabled>
          <Typography component="h3">Toplantı Odası Seç</Typography>
        </MenuItem>
        {meetingRooms.map(room => (
          <MenuItem key={room.id} value={room.id} aria-label={`Oda: ${room.name}, Kapasite: ${room.capacity}`}>
            {room.name} - Kapasite: {room.capacity}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default RoomSelector;
