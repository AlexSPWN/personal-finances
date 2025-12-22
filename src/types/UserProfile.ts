export type UserRole = "admin" | "manager" | "user";

export type UserProfile = {
  email: string | null;
  role: UserRole;
  language: "en" | "uk";
  createdAt: number;
};