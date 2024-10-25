import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

import { saveReservationToDB } from "../../../lib/mongo";

export const POST = async (request: NextRequest): Promise<Response> => {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 401 });
    }

    const reservationData = await request.json();

    const reservation = {
      userId,
      startTime: new Date(reservationData.startTime),
      endTime: new Date(reservationData.endTime),
      roomId: reservationData.roomId,
    };

    await saveReservationToDB(reservation);

    return NextResponse.json({ message: "Reservation successful" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to make reservation" }, { status: 500 });
  }
};
