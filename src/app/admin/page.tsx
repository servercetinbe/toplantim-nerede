"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress, Container, List, ListItem, ListItemText, Typography } from "@mui/material";

interface AdminData {
  userCount: number;
  adminCount: number;
  adminList: Array<{ id: string; username: string }>;
}

export default function AdminDashboard(): JSX.Element {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin");
        const result: AdminData = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        Admin Dashboard
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Total Users: {data?.userCount ?? "Loading..."}</Typography>
        <Typography variant="h6">Total Admins: {data?.adminCount ?? "Loading..."}</Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Admin List:</Typography>
        <List>
          {data?.adminList.map(admin => (
            <ListItem key={admin.id}>
              <ListItemText primary={admin.username} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}
