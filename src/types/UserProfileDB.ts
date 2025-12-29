export type UserRole = "admin" | "manager" | "user";
export type LanguageUI = "en" | "uk";

export type UserProfileDB = {
  email: string | null;
  role: UserRole;
  language: LanguageUI;
  createdAt: number;
};