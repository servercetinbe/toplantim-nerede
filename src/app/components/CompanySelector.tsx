import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import { Company } from "../types/Company";
import { CompanySelectorProps } from "../types/CompanySelectorProps";

const CompanySelector: React.FC<CompanySelectorProps> = ({
  companies,
  selectedCompany,
  setSelectedCompany,
  setMeetingRooms,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const company = companies.find((c: Company) => c.name === event.target.value);
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
        aria-label="Firma Seç"
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
          <Typography component="h3">Firma Seç</Typography>
        </MenuItem>
        {companies.map((company: Company) => (
          <MenuItem key={company.name} value={company.name}>
            {company.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CompanySelector;
