import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const dataPath = path.join(process.cwd(), "data", "reservations.json");

interface Reservation {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  roomId: string;
}

const saveReservationToFile = (reservation: Reservation) => {
  const data = fs.readFileSync(dataPath, "utf-8");
  const reservations = JSON.parse(data);
  reservations.push(reservation);
  fs.writeFileSync(dataPath, JSON.stringify(reservations, null, 2));
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const reservationData = await request.json();
    const reservation = {
      id: String(new Date().getTime()),
      userId: reservationData.userId || "guest",
      startTime: reservationData.startTime,
      endTime: reservationData.endTime,
      roomId: reservationData.roomId,
    };

    saveReservationToFile(reservation);

    return NextResponse.json({ message: "Reservation successful" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save reservation" }, { status: 500 });
  }
};
