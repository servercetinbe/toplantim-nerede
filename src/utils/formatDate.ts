import { Reservation } from "@/app/types/Reservation";

export const formatReservationTime = (reservation: Reservation): string => {
  const startDate = new Date(reservation.startTime);
  const endDate = new Date(reservation.endTime);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};
