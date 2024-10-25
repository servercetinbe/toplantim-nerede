import { PrismaClient, Reservation } from "@prisma/client"; // Prisma'nın Reservation modelini import ediyoruz.

const prisma = new PrismaClient();

type ReservationInput = {
  userId: string;
  date: Date;
  time: string;
  roomId: string;
};

const saveReservationToDB = async (reservation: ReservationInput): Promise<Reservation> => {
  try {
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        roomId: reservation.roomId,
        date: reservation.date,
        time: reservation.time,
      },
    });

    if (existingReservation) {
      throw new Error("Room already booked for this time.");
    }

    const newReservation = await prisma.reservation.create({
      data: reservation,
    });

    return newReservation;
  } catch (error) {
    console.error("Error saving reservation:", error);
    throw error;
  }
};

export { saveReservationToDB };
