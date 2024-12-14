"use client";

import { useEffect, useState } from "react";

import { ApiResponse, User } from "../types/User";

type FetchUsersHook = {
  users: User[];
  loading: boolean;
  error: string | null;
};

const useFetchUsers = (): FetchUsersHook => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const API_URL = "https://development.api.bookease.app/api/user";
        const BEARER_TOKEN = "26|SMYbDcpBJ4LQkmTVuHwxcsrzPurCucZLpqymsDcp3fe20c94";

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const responseData: ApiResponse = await response.json();

        setUsers(
          responseData.data.map((user: User) => ({
            id: user.id,
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
          }))
        );
        setLoading(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useFetchUsers;
