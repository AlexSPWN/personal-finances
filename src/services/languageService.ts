import { ref, update } from "firebase/database";
import { db } from "../firebase/firebase";
import type { LanguageUI } from "../types/UserProfileDB";

export const updateUserLanguage = async (
  uid: string,
  language: LanguageUI
) => {
  return update(ref(db, `users/${uid}`), { language });
};
