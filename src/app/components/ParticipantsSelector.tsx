"use client";

import React from "react";
import { alpha, Autocomplete, Box, TextField, Typography } from "@mui/material";
import Popper from "@mui/material/Popper";
import { Users } from "lucide-react";

import { ParticipantSelectorProps } from "../types/ParticipantSelectorProps";

const CustomPopper = (props: React.ComponentProps<typeof Popper>) => (
  <Popper {...props} placement="bottom-start" modifiers={[{ name: "flip", enabled: false }]} />
);

const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({
  users,
  participants,
  setParticipants,
  loading,
  error,
}) => {
  let content;

  if (loading) {
    content = <Typography>Loading users...</Typography>;
  } else if (error) {
    content = <Typography>Error: {error}</Typography>;
  } else {
    content = (
      <Autocomplete
        multiple
        options={users}
        getOptionLabel={option => `${option.first_name} ${option.last_name}`}
        value={users.filter(user => participants.includes(user.id))}
        onChange={(_, newValue) => setParticipants(newValue.map(user => user.id))}
        renderInput={params => (
          <TextField
            {...params}
            label="Katılımcıları Seç"
            variant="outlined"
            placeholder={participants.length === 0 ? "Katılımcı ekle..." : ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "white",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(67, 56, 202, 0.04)",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 0 2px rgba(67, 56, 202, 0.2)",
                },
              },
            }}
          />
        )}
        PopperComponent={CustomPopper}
        sx={{
          "& .MuiChip-root": {
            borderRadius: "8px",
            backgroundColor: alpha("#4338CA", 0.1),
            color: "#4338CA",
            margin: "2px",
            "& .MuiChip-deleteIcon": {
              color: "#4338CA",
              "&:hover": {
                color: "#3730A3",
              },
            },
          },
        }}
      />
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Users size={24} style={{ marginRight: "12px", color: "#4338CA" }} />
        <Typography variant="h6" fontWeight={600}>
          Katılımcılar
        </Typography>
      </Box>
      {content}
    </>
  );
};

export default ParticipantSelector;
