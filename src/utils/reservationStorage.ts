export interface Reservation {
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
  participants?: Array<{ id: string; name: string }>;
}

export const getReservationsFromStorage = (): Reservation[] => {
  const reservations = localStorage.getItem("reservations");
  return reservations ? JSON.parse(reservations) : [];
};

export const saveReservationToStorage = (reservation: Reservation): void => {
  const currentReservations = getReservationsFromStorage();
  currentReservations.push(reservation);
  localStorage.setItem("reservations", JSON.stringify(currentReservations));
};
