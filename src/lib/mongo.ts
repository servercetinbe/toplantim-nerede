import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Reservation = {
  userId: string;
  date: Date;
  time: string;
  roomId: string;
};

export async function saveReservationToDB(reservation: Reservation) {
  try {
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        roomId: reservation.roomId,
        date: reservation.date,
        time: reservation.time,
      },
    });

    if (existingReservation) {
      throw new Error('Room already booked for this time.');
    }

    const newReservation = await prisma.reservation.create({
      data: reservation,
    });

    return newReservation;
  } catch (error) {
    console.error('Error saving reservation:', error);
    throw error;
  }
}
