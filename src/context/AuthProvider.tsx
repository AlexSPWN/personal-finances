import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { AuthContext } from "./AuthContext";
import { ensureUserProfile, subscribeToUserProfile } from "../services/userService";
import type { UserProfileDB } from "../types/UserProfileDB";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileDB | null>(null)
  const [loading, setLoading] = useState(true);

  const unsubscribeProfileRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      
      // cleanup old listener
      if (unsubscribeProfileRef.current) { // if active DB listener?
        unsubscribeProfileRef.current(); // stop old listeners () => off(userRef)
        unsubscribeProfileRef.current = null; // clear reference
      }

      if(user) {
        await ensureUserProfile(user.uid, user.email);

        unsubscribeProfileRef.current = subscribeToUserProfile(
          user.uid,
          setProfile
        );

        //const profileData = await getUserProfile(user.uid);
        setUser(user);
        //setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    //return unsubscribe;
    return () => {
      unsubscribeAuth();
      if(unsubscribeProfileRef.current) {
        unsubscribeProfileRef.current()
      }
    } 
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};