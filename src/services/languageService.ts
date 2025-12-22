import { ref, update } from "firebase/database";
import { db } from "../firebase/firebase";
import type { Language } from "../types/UserProfileDB";

export const updateUserLanguage = async (
  uid: string,
  language: Language
) => {
  return update(ref(db, `users/${uid}`), { language });
};
