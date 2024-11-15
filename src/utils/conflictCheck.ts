import { getReservationsFromStorage } from "./reservationStorage";

export const checkReservationConflict = (startTime: Date | string, endTime: Date | string, roomId: string): boolean => {
  const reservations = getReservationsFromStorage();
  const newStart = new Date(startTime).getTime();
  const newEnd = new Date(endTime).getTime();

  return reservations.some(reservation => {
    if (reservation.roomId !== roomId) return false; // Sadece aynı odadaki rezervasyonları kontrol et
    const existingStart = new Date(reservation.startTime).getTime();
    const existingEnd = new Date(reservation.endTime).getTime();

    return !(newEnd <= existingStart || newStart >= existingEnd);
  });
};
