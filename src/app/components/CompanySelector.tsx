import React from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface Company {
  name: string;
  rooms: Room[];
}

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: string;
  setSelectedCompany: React.Dispatch<React.SetStateAction<string>>;
  setMeetingRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
  companies,
  selectedCompany,
  setSelectedCompany,
  setMeetingRooms,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const company = companies.find(c => c.name === event.target.value);
    setSelectedCompany(company?.name || "");
    setMeetingRooms(company?.rooms || []);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="company-select-label">Firma Seç</InputLabel>
      <Select
        labelId="company-select-label"
        value={selectedCompany}
        onChange={handleChange}
        label="Firma Seç"
        sx={{
          borderRadius: "12px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.23)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.87)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4338CA",
          },
        }}
      >
        <MenuItem value="" disabled>
          <Typography>Firma Seç</Typography>
        </MenuItem>
        {companies.map(company => (
          <MenuItem key={company.name} value={company.name}>
            {company.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CompanySelector;
