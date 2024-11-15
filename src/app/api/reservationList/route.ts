import fs from "fs";
import path from "path";

import { NextResponse } from "next/server";

const dataPath = path.join(process.cwd(), "data", "reservations.json");

export const GET = async (): Promise<NextResponse> => {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const reservations = JSON.parse(data);
    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
};
