import { PrismaClient, Reservation } from "@prisma/client";

const prisma = new PrismaClient();

type ReservationInput = {
  userId: string;
  startTime: Date;
  endTime: Date;
  roomId: string;
};

const saveReservationToDB = async (reservation: ReservationInput): Promise<Reservation> => {
  try {
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        roomId: reservation.roomId,
        OR: [
          {
            AND: [{ startTime: { lte: reservation.startTime } }, { endTime: { gt: reservation.startTime } }],
          },
          {
            AND: [{ startTime: { lt: reservation.endTime } }, { endTime: { gte: reservation.endTime } }],
          },
        ],
      },
    });

    if (existingReservation) {
      throw new Error("Room already booked for this time slot.");
    }

    const newReservation = await prisma.reservation.create({
      data: {
        userId: reservation.userId,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        roomId: reservation.roomId,
      },
    });

    return newReservation;
  } catch (error) {
    console.error("Error saving reservation:", error);
    throw error;
  }
};

export { saveReservationToDB };
