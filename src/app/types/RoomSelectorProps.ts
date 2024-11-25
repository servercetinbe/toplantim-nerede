import { Room } from "./Room";

export interface RoomSelectorProps {
  meetingRooms: Room[];
  selectedRoom: string;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string>>;
}
