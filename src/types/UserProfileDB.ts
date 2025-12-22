export type UserRole = "admin" | "manager" | "user";
export type Language = "en" | "uk";

export type UserProfileDB = {
  email: string | null;
  role: UserRole;
  language: Language;
  createdAt: number;
};