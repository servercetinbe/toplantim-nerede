import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/express";

export const GET = async (_req: NextRequest): Promise<NextResponse> => {
  try {
    const users = await clerkClient.users.getUserList();
    const formattedUsers = users.data.map(user => ({
      id: user.id,
      name: user.fullName || user.username || user.emailAddresses[0]?.emailAddress,
    }));
    return NextResponse.json(formattedUsers, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Error fetching users", error }, { status: 500 });
  }
};
