import { User } from "./User";

export interface ParticipantSelectorProps {
  users: User[];
  participants: string[];
  setParticipants: (participants: string[]) => void;
  loading: boolean;
  error: string | null;
}
