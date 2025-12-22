import type { UserProfileDB } from "../types/UserProfileDB";

export const createDefaultUserProfile = (
  email: string | null
): UserProfileDB => ({
  email,
  role: "user",
  language: "en",
  createdAt: Date.now(),
});
