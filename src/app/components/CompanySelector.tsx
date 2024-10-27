import React from "react";
import { Select, MenuItem, Typography, SelectChangeEvent } from "@mui/material";

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

const CompanySelector: React.FC<CompanySelectorProps> = ({ companies, selectedCompany, setSelectedCompany, setMeetingRooms }) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const company = companies.find((c) => c.name === event.target.value);
    setSelectedCompany(company?.name || "");
    setMeetingRooms(company?.rooms || []);
  };

  return (
    <Select value={selectedCompany} onChange={handleChange} displayEmpty fullWidth>
      <MenuItem value="" disabled>
        <Typography>Select Company</Typography>
      </MenuItem>
      {companies.map((company) => (
        <MenuItem key={company.name} value={company.name}>
          {company.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CompanySelector;
