import React, {useContext, useState, useEffect} from "react";
import fbArray from '../apis/firebase.js';

const AuthContext = React.createContext();
const auth = fbArray.auth;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  //this function takes the input from the signupform and generates an account
  //through firebase. We can switch to any authentication system by
  //changing this function
  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  //this function takes the input from the loginform and authenticates
  //through firebase. We can switch to any authentication system by
  //changing this function
  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }
  
  //the value received from AuthContext.Provider contains all the info
  //to authenticate users and asign them a state for currentUser and setCurrentUser
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}