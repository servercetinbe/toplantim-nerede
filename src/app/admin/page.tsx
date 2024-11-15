"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={5} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", mt: 4 }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card
            elevation={3}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Total User
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              {data?.userCount ?? "Loading..."}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card
            elevation={3}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Total Admin
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              {data?.adminCount ?? "Loading..."}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ mt: 6, p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Admin List:
        </Typography>
        <List>
          {data?.adminList.map(admin => (
            <ListItem
              key={admin.id}
              sx={{
                borderBottom: "1px solid #e0e0e0",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <ListItemText primary={admin.username} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
