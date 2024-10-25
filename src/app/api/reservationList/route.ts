import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (_request: NextRequest): Promise<Response> => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        startTime: "asc",
      },
    });

    const populatedReservations = await Promise.all(
      reservations.map(async reservation => {
        const room = await prisma.meetingRoom.findUnique({
          where: { id: reservation.roomId },
        });

        let user = null;
        if (reservation.userId) {
          user = await prisma.user.findUnique({
            where: { id: reservation.userId },
          });
        }

        return {
          ...reservation,
          room,
          user: user ? { id: user.id, email: user.email, name: user.name } : null,
        };
      })
    );

    return NextResponse.json(populatedReservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
};
