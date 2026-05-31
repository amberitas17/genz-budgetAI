import { useState } from "react";
import { supabase } from "../supabase";

export default function Profile({ user, setPage }) {
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [loading, setLoading] = useState(false);

  // ✅ Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPage("login"); // or wherever your login page is
  };

  // ✅ Update name
const handleUpdateName = async () => {
  setLoading(true);

  // ✅ 1. Update auth metadata
  const { error: authError } = await supabase.auth.updateUser({
    data: { name },
  });

  // ✅ 2. Update profiles table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", user.id); // make sure id matches auth.users.id

  if (authError || profileError) {
    alert(
      "Error updating name: " +
        (authError?.message || profileError?.message)
    );
  } else {
    alert("Name updated successfully!");
  }

  setLoading(false);
};


  return (
    <div className="auth">
      <div className="auth-card">
        <h1>👤 Profile</h1>

        <p>Email: {user?.email}</p>

        {/* ✅ Edit Name */}
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button onClick={handleUpdateName} disabled={loading}>
          {loading ? "Saving..." : "Update Name"}
        </button>

        <br /><br />

        {/* ✅ Back */}
        <button onClick={() => setPage("dashboard")}>
          Back to Dashboard
        </button>

        <br /><br />

        {/* ✅ Logout */}
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}