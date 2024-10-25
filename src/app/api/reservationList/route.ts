import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (_request: NextRequest): Promise<Response> => {
  try {
    const { userId } = getAuth(_request);

    const reservations = await prisma.reservation.findMany();

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
        } else if (userId) {
          user = await prisma.user.findUnique({
            where: { clerkId: userId },
          });
        }

        return {
          ...reservation,
          room,
          user: user ? user : null,
        };
      })
    );

    return NextResponse.json(populatedReservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
};
