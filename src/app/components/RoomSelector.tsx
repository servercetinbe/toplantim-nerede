import React from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface RoomSelectorProps {
  meetingRooms: Room[];
  selectedRoom: string;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string>>;
}

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
          <Typography>Toplantı Odası Seç</Typography>
        </MenuItem>
        {meetingRooms.map(room => (
          <MenuItem key={room.id} value={room.id}>
            {room.name} - Kapasite: {room.capacity}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default RoomSelector;
