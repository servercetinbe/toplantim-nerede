"use client";

import React, { useState } from "react";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";

const Home = (): React.ReactElement => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const arr = input.split(",").map(Number);

    try {
      const response = await fetch("/api/max", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ arr }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
        setError(null);
      } else {
        setError(data.error.message);
        setResult(null);
      }
    } catch (error) {
      setError("An error occurred");
      setResult(null);
      console.log(error);
    }
  };

  return (
    <>
      <Container maxWidth="sm" style={{ marginTop: "50px" }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Max Subarray Sum Calculator
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Enter an array of numbers"
            variant="outlined"
            value={input}
            onChange={e => setInput(e.target.value)}
            fullWidth
          />

          <Button type="submit" variant="contained" color="primary" size="large">
            Calculate
          </Button>
        </Box>

        <Box mt={3}>
          {result !== null && <Alert severity="success">Max subarray sum: {result}</Alert>}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;
