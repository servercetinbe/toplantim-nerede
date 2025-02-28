"use client";

import React, { useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";

const Home = (): React.ReactElement => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convertToCamelCase = (str: string): string =>
    str
      .split(/[^a-zA-Z]+/)
      .map((word, index) =>
        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          String Challenge 1
        </Typography>
        <TextField
          fullWidth
          label="Enter your text"
          variant="outlined"
          value={input}
          onChange={e => setInput(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setOutput(convertToCamelCase(input))}
          sx={{ mt: 2, py: 1 }}
        >
          Convert
        </Button>
        {output && (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              Output:
            </Typography>
            <Typography variant="h6" color="primary">
              {output}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Home;
