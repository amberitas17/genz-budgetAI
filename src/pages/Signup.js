import { useState } from "react";
import { supabase } from "../supabase";

export default function Signup({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Email + Password Signup
  const handleSignup = async () => {
    if (!email || !password) return;

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    // ✅ Insert into profiles table
    if (user) {
      await supabase.from("profiles").insert([
        {
          id: user.id,
          name: "", // empty for now
        },
      ]);
    }

    alert("Check your email for verification 📩");
    setPage("login");
    setLoading(false);
  };

  // ✅ Google Signup/Login
  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://amberitas17.github.io/genz-budgetAI",
      },
    });
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <h1>Sign Up 🚀</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <hr />

        {/* ✅ Google button */}
        <button onClick={handleGoogleSignup}>
          Continue with Google
        </button>

        <p>
          Already have an account?{" "}
          <span onClick={() => setPage("login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}