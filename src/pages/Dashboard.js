import React, {
  useState,
  useEffect,
} from "react";

import { motion } from "framer-motion";

import { getAISuggestion }
  from "../utils/aiSuggestions";
import { supabase } from "../supabase";
import PersonIcon from "@mui/icons-material/Person";


export default function Dashboard({
  user,
  setUser,
  setPage,
}) {
  const [expenses, setExpenses] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("🍔 Food");

  const [goal, setGoal] =
    useState("");

  const [saved, setSaved] =
    useState(0);

  const [notification, setNotification] =
    useState("");
  // const [user, setUser] = useState(null);
  useEffect(() => {
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();

    console.log("SESSION:", data);

    if (data.session) {
      setUser(data.session.user);
    } else {
      console.log("No active session ❌");
    }
  };

  checkSession();
}, []);

  useEffect(() => {
  const fetchExpenses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    if (data) setExpenses(data);
  };

  fetchExpenses();
}, [user]);


  const autoSaveRate = 0.1;


  const addExpense = async () => {
  if (!user) {
    setNotification("⚠️ User not logged in");
    return;
  }

  if (!title.trim() || Number(amount) <= 0) {
    setNotification("⚠️ Enter valid expense.");
    return;
  }

  const expenseAmount = Number(amount);

  const autoSaved =
    expenseAmount * autoSaveRate;

  const newSavings =
    saved + autoSaved;

  console.log("AutoSaved:", autoSaved);
  console.log("New Savings:", newSavings);

  // ✅ UPDATE STATE
  setSaved(newSavings);

  // ✅ SAVE GOALS TABLE

  // ✅ INSERT EXPENSE
  const { data, error } =
    await supabase
      .from("expenses")
      .insert([
        {
          user_id: user.id,
          title,
          amount: expenseAmount,
          category,
        },
      ])
      .select();
      

  if (error) {
    console.error(error);

    setNotification(
      "❌ Failed to save"
    );

    return;
  }

  if (data) {
    setExpenses([
      ...expenses,
      data[0],
    ]);
  }
  

  setNotification(
    "✅ Expense added!"
  );

  setTitle("");
  setAmount("");
};

useEffect(() => {
  if (!user || goal === "") return;

  const saveGoal = async () => {
    const { error } = await supabase
  .from("goals")
  .upsert(
    [
      {
        user_id: user.id,
        goal_amount: Number(goal),
        saved_amount: saved,
      },
    ],
    {
      onConflict: "user_id", // ✅ THIS IS THE FIX
    }
  );

    if (error) {
      console.error("Goal save error:", error);
    } else {
      console.log("✅ Goal saved");
    }
  };

  const timeout = setTimeout(saveGoal, 500);

  return () => clearTimeout(timeout);
}, [goal, user, saved]); // ✅ FIXED dependencies

useEffect(() => {
  const fetchGoal = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Fetch goal error:", error);
      return;
    }

    if (data) {
      console.log("✅ Loaded goal:", data); // debugging

      setGoal(data.goal_amount || "");
      setSaved(data.saved_amount || 0);
    }
  };

  fetchGoal();
}, [user]);

  // const total = expenses.reduce(
  //   (sum, e) => sum + e.amount,
  //   0
  // );




const progress = Number(goal)
  ? Math.min((saved / Number(goal)) * 100, 100)
  : 0;

  

  return (
    <div className="container">
      <div className="header">
        <h1>💰 Gen Z Budget AI</h1>

        <button className="profile-btn" onClick={() => setPage("profile")}>
          <PersonIcon />
        </button>
      </div>

      {notification && (
        <div className="notif">
          {notification}
        </div>
      )}

      <div className="card">
        <h2>➕ Add Expense</h2>

        <input
          placeholder="Expense"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option>
            🍔 Food
          </option>

          <option>
            🛍 Shopping
          </option>

          <option>
            🎮 Gaming
          </option>

          <option>
            🚗 Transport
          </option>
        </select>

        <button onClick={addExpense}>
          Add Expense
        </button>
      </div>

      <div className="card">
        <h2>🎯 Savings Goal</h2>

        <input
          type="number"
          placeholder="Set Goal"
          value={goal}
          onChange={(e) => {
        setGoal(e.target.value);
        }}
        />

        <div className="progress">
          <div
            className="bar"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>

        <p>
        ₱{Number(saved).toFixed(2)} / ₱{Number(goal || 0).toFixed(2)}
        ({progress.toFixed(1)}%)

        </p>
      </div>

      <div className="card">
        <h2>🤖 Smart Insight</h2>

        <p>
          {getAISuggestion(
            expenses,
            Number(goal),
            Number(saved)
          )}
        </p>
      </div>

      <div className="card">
        <h2>📋 Expenses</h2>

        {expenses.map((e, i) => (
          <motion.div
            key={i}
            className="expense"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div>
              <strong>
                {e.title}
              </strong>

              <br />

              <small>
                {e.category}
              </small>
            </div>

            <span>
              ₱{e.amount}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}