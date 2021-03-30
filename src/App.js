import React from "react";
import NavBar from './components/NavBar';
import {AuthProvider} from "./contexts/AuthContext";

export default function App() {
  return (
    <div>
      <AuthProvider>
        <NavBar />
      </AuthProvider>
    </div>
  );
}