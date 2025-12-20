import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const googleProvider = new GoogleAuthProvider();

export const registerEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const loginGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const logout = () => signOut(auth);