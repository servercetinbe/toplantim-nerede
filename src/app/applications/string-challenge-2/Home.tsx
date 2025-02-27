"use client";

import React, { useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";

const Home = (): React.ReactElement => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const stringChallenge = (str: string): string => {
    const validElements = new Set(["b", "i", "em", "div", "p"]);
    const stack: { tag: string; index: number }[] = [];
    let currentTag = "";
    let isOpenTag = false;

    for (let i = 0; i < str.length; i += 1) {
      if (str[i] === "<") {
        isOpenTag = true;
        currentTag = "";
        continue;
      }

      if (str[i] === ">") {
        isOpenTag = false;

        if (currentTag.startsWith("/")) {
          const closingTag = currentTag.slice(1);

          if (stack.length === 0) {
            return closingTag;
          }

          const lastTag = stack.pop();

          if (lastTag && lastTag.tag !== closingTag) {
            return lastTag.tag;
          }
        } else {
          if (!validElements.has(currentTag)) {
            return "false";
          }
          stack.push({ tag: currentTag, index: i });
        }
        continue;
      }

      if (isOpenTag) {
        currentTag += str[i];
      }
    }

    return stack.length === 0 ? "true" : stack[0].tag;
  };

  const handleCheck = () => {
    setOutput(stringChallenge(input));
  };
  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Paper elevation={3} sx={{ width: "100%", p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          String Challenge
        </Typography>

        <TextField
          fullWidth
          label="Enter HTML string"
          variant="outlined"
          value={input}
          onChange={e => setInput(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" color="primary" fullWidth onClick={handleCheck} sx={{ mb: 3 }}>
          CHECK HTML TAGS
        </Button>

        {output && (
          <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1, textAlign: "center" }}>
            <Typography variant="h6">
              Output:{" "}
              <Box component="span" sx={{ color: "primary.main", fontWeight: "bold" }}>
                {output}
              </Box>
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Home;
