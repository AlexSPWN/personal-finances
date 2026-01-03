export type UserRole = "admin" | "manager" | "user";
export type ViewerRole = "admin" | "manager";
export type LanguageUI = "en" | "uk";

export type UserProfileDB = {
  email: string | null;
  role: UserRole;
  language: LanguageUI;
  createdAt: number;
};