"use client";

import React from "react";
import { alpha, Autocomplete, TextField } from "@mui/material";

import useFetchUsers from "../hooks/useFetchUsers";

interface AsyncUserSelectboxProps {
  value: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  label?: string;
}

const AsyncUserSelectbox = ({
  value,
  onChange,
  placeholder = "Katılımcı ekle...",
  label = "Katılımcıları Seç",
}: AsyncUserSelectboxProps): JSX.Element => {
  const { users, loading, error } = useFetchUsers();

  if (error) {
    return <div>Error: {error}</div>;
  }

  const selectedUsers = users.filter(user => value.includes(user.id));

  return (
    <Autocomplete
      multiple
      options={users}
      loading={loading}
      value={selectedUsers}
      getOptionLabel={option => `${option.first_name} ${option.last_name}`}
      onChange={(_, newValue) => onChange(newValue.map(user => user.id))}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          placeholder={value.length === 0 ? placeholder : ""}
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
};

export default AsyncUserSelectbox;
