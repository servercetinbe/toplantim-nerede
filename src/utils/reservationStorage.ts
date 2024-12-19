import { Reservation } from "@/app/types/Reservation";

export const getReservationsFromStorage = (): Reservation[] => {
  const reservations = localStorage.getItem("reservations");
  return reservations ? JSON.parse(reservations) : [];
};

export const saveReservationToStorage = (reservation: Reservation): void => {
  const currentReservations = getReservationsFromStorage();
  currentReservations.push(reservation);
  localStorage.setItem("reservations", JSON.stringify(currentReservations));
};
