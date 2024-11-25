import { Reservation } from "./Reservation";

export interface ReservationListProps {
  reservations: Reservation[];
  currentUser: string | undefined;
}
