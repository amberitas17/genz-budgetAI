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
  
// useEffect(() => {
//   const getUser = async () => {
//     const { data } = await supabase.auth.getUser();

//     if (data.user) {
//       setUser(data.user);
//       setPage("dashboard");
//     }
//   };
//   console.log("Checking auth status...", user); // ✅ ADD THIS

//   getUser();
// }, []);
useEffect(() => {
  // ✅ Check session on page load
  const getUser = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      setUser(data.session.user);
      setPage("dashboard");
    }
  };

  getUser();

  // ✅ LISTEN to login/logout events (THIS FIXES YOUR PROBLEM)
  const { data: listener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log("Auth event:", event);

      if (session) {
        setUser(session.user);
        setPage("dashboard"); // ✅ AUTO REDIRECT
      } else {
        setUser(null);
        setPage("login");
      }
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
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