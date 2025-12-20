import { ref, set, get } from "firebase/database";
import { db } from "../firebase/firebase";

export const getUserProfile = async (uid: string) => {
  const snapshot = await get(ref(db, `users/${uid}`));
  return snapshot.exists() ? snapshot.val() : null;
};

export const saveUserProfile = (uid: string) =>
  set(ref(db, `users/${uid}`), {
    role: "user",
    createdAt: Date.now(),
  });