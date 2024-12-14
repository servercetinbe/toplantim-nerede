import { ParticipantUser } from "./ParticipantUser";

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface ReservationUser {
  id: string;
  name?: string;
  email: string;
}

export interface Reservation {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  roomId: string;
  room?: Room;
  user?: ReservationUser | null;
  participants?: ParticipantUser[];
}
