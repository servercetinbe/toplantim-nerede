import { Company } from "./Company";
import { Room } from "./Room";

export interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: string;
  setSelectedCompany: React.Dispatch<React.SetStateAction<string>>;
  setMeetingRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}
