import { Room } from "./Room";

export interface Reservation {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  roomId: string;
  room?: Room;
  user?: {
    id: string;
    name?: string;
    email: string;
  } | null;
  participants?: Array<{ id: string; name: string }>;
}
