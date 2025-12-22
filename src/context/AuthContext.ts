import { createContext } from "react";
import type { User } from "firebase/auth";
import type { UserProfileDB } from "../types/UserProfileDB";

export type AuthContextType = {
  user: User | null;
  profile: UserProfileDB | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});
