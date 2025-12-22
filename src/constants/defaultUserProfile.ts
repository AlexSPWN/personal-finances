import type { UserProfile } from "../types/UserProfile";

export const createDefaultUserProfile = (
  email: string | null
): UserProfile => ({
  email,
  role: "user",
  language: "en",
  createdAt: Date.now(),
});
