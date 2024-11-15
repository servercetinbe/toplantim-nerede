import { Reservation } from "./reservationStorage";

export const formatReservationTime = (reservation: Reservation): string => {
  const startTime = new Date(reservation.startTime);
  const endTime = new Date(reservation.endTime);

  const dateStr = startTime.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = `${startTime.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${endTime.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return `${dateStr} ${timeStr}`;
};
