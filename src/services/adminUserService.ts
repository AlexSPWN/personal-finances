import { ref, onValue, update, off } from "firebase/database";
import { db } from "../firebase/firebase";
import type { UserProfileDB, UserRole } from "../types/UserProfileDB";

export type UserWithId = UserProfileDB & { uid: string };

export const subscribeToAllUsers = (
  callback: (users: UserWithId[]) => void
) => {
  const usersRef = ref(db, "users");

  onValue(usersRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val();

    const users: UserWithId[] = Object.entries(data).map(
      ([uid, profile]) => ({
        uid,
        ...(profile as UserProfileDB),
      })
    );

    callback(users);
  });

  return () => off(usersRef);
};

export const updateUserRole = async (
  uid: string,
  role: UserRole
) => {
  return update(ref(db, `users/${uid}`), { role });
};
