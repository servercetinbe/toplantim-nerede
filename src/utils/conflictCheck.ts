import { getReservationsFromStorage } from "./reservationStorage";

export const checkReservationConflict = (startTime: string, endTime: string, roomId: string): boolean => {
  const reservations = getReservationsFromStorage();
  const newStart = new Date(startTime).getTime();
  const newEnd = new Date(endTime).getTime();

  return reservations.some(reservation => {
    if (reservation.roomId !== roomId) return false;
    const existingStart = new Date(reservation.startTime).getTime();
    const existingEnd = new Date(reservation.endTime).getTime();

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
};
