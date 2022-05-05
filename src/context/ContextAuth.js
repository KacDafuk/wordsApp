import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, firestore } from "../firebaseConfig";

const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);
const ContextAuth = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);
  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logout() {
    return signOut(auth);
  }
  function reset(email) {
    return sendPasswordResetEmail(auth, email);
  }
  async function addUserToCol(id) {
    await setDoc(doc(firestore, "users", id), { words: [] });
  }

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, reset, addUserToCol }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default ContextAuth;

//create quick way to write whole context
