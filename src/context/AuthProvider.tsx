import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { AuthContext } from "./AuthContext";
import {
  ensureUserProfile,
  subscribeToUserProfile,
} from "../services/userService";
import type { UserProfileDB } from "../types/UserProfileDB";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const unsubscribeProfileRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // cleanup old listener
      if (unsubscribeProfileRef.current) {
        // if active DB listener?
        unsubscribeProfileRef.current(); // stop old listeners () => off(userRef)
        unsubscribeProfileRef.current = null; // clear reference
      }

      if (user) {
        setUser(user);
        setProfileLoading(true);

        await ensureUserProfile(user.uid, user.email);

        unsubscribeProfileRef.current = subscribeToUserProfile(
          user.uid,
          (profile) => {
            setProfile(profile);
            setProfileLoading(false); // ✅ profile READY
          }
        );
      } else {
        setUser(null);
        setProfile(null);
        setProfileLoading(false);
      }

      setLoading(false); // auth READY
    });

    //return unsubscribe;
    return () => {
      unsubscribeAuth();
      if (unsubscribeProfileRef.current) {
        unsubscribeProfileRef.current();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading: loading || profileLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
