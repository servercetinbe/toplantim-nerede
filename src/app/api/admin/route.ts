// /app/api/admin/route.ts
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const GET = async (): Promise<NextResponse> => {
  try {
    const allUsersResponse = await clerkClient.users.getUserList();
    const allUsers = allUsersResponse.data;
    const userCount = allUsers.length;

    const adminUsers = allUsers.filter(user => user.publicMetadata?.role === "admin");
    const adminCount = adminUsers.length;

    const adminList = adminUsers.map(user => ({
      id: user.id,
      username: user.username || user.firstName || "Unknown",
    }));

    return NextResponse.json({ userCount, adminCount, adminList });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
};
