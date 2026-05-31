import { useState } from "react";
import { supabase } from "../supabase";

export default function Login({
  setPage,
  setUser,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

const handleLogin = async () => {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    alert(error.message);
    return;
  }

  const user = data.user;

  // ✅ CREATE / UPDATE PROFILE
  await supabase.from("profiles").upsert([
    {
      id: user.id,
      email: user.email,
    },
  ]);

  setUser(user);
  setPage("dashboard");
};

  return (
    <div className="auth">
      <div className="auth-card">
        <h1>Login 💜</h1>

        <input
          placeholder="Email"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <p>
          No account?{" "}
          <span
            onClick={() =>
              setPage("signup")
            }
          >
            Sign up
          </span>
        </p>
        <button
  onClick={async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",  
      options: {
          redirectTo: window.location.origin + "/YOUR-REPO"
        }

    });
  }}
>
  Login with Google 🚀
</button>
      </div>
    </div>
  );
}