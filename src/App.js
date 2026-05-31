import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import { supabase } from "./supabase";

import "./index.css";

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  
useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      setUser(data.user);
      setPage("dashboard");
    }
  };
  console.log("Checking auth status...", user); // ✅ ADD THIS

  getUser();
}, []);


  return (
    <>
      {page === "login" && (
        <Login
          setPage={setPage}
          setUser={setUser}
        />
      )}

      {page === "signup" && (
        <Signup setPage={setPage} />
      )}

      {page === "profile" && (
        <Profile
          user={user}
          setPage={setPage}
        />
      )}

      {page === "dashboard" && (
        
        <Dashboard
          user={user}
          setUser={setUser}
          setPage={setPage}
        />

      )}
    </>
  );
}