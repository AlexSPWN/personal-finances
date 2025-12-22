export type UserRole = "admin" | "manager" | "user";

export type UserProfileDB = {
  email: string | null;
  role: UserRole;
  language: "en" | "uk";
  createdAt: number;
};