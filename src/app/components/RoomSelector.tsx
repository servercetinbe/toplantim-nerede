import React from "react";
import { Select, MenuItem, Typography, SelectChangeEvent } from "@mui/material";

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
    <Select value={selectedRoom} onChange={handleChange} displayEmpty fullWidth>
      <MenuItem value="" disabled>
        <Typography>Select Room</Typography>
      </MenuItem>
      {meetingRooms.map((room) => (
        <MenuItem key={room.id} value={room.id}>
          {room.name} - Capacity: {room.capacity}
        </MenuItem>
      ))}
    </Select>
  );
};

export default RoomSelector;