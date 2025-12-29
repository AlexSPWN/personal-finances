import { ref, set, get, off, onValue, update } from "firebase/database";
import { db } from "../firebase/firebase";
import { createDefaultUserProfile } from "../constants/defaultUserProfile";
import type { LanguageUI, UserProfileDB } from "../types/UserProfileDB";

export const getUserProfile = async (uid: string): Promise<UserProfileDB | null> => {
  const snapshot = await get(ref(db, `users/${uid}`));
  return snapshot.exists() ? snapshot.val() : null;
};

export const saveUserProfile = (uid: string) =>
  set(ref(db, `users/${uid}`), {
    role: "user",
    createdAt: Date.now(),
  });

export const ensureUserProfile = async (
  uid: string,
  email: string | null
) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    const profile = createDefaultUserProfile(email);
    await set(userRef, profile);
  }
};

export const subscribeToUserProfile = (
  uid: string,
  callback: (profile: UserProfileDB | null) => void
) => {
  const userRef = ref(db, `users/${uid}`);

  onValue(userRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });

  return () => off(userRef);
};

export const updateUserLanguage = (uid: string, language: LanguageUI) => {
  const userRef = ref(db, `users/${uid}`);
  return update(userRef, { language });
}