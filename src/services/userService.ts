import { ref, set, get } from "firebase/database";
import { db } from "../firebase/firebase";
import { createDefaultUserProfile } from "../constants/defaultUserProfile";

export const getUserProfile = async (uid: string) => {
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