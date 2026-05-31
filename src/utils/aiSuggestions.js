export function getAISuggestion(
  expenses,
  goal,
  saved
) {
  const total = expenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  const food = expenses
    .filter((e) => e.category === "🍔 Food")
    .reduce((sum, e) => sum + e.amount, 0);

  const shopping = expenses
    .filter((e) => e.category === "🛍 Shopping")
    .reduce((sum, e) => sum + e.amount, 0);

  const gaming = expenses
    .filter((e) => e.category === "🎮 Gaming")
    .reduce((sum, e) => sum + e.amount, 0);

  if (saved >= goal && goal > 0) {
    return "🏆 Financial glow-up unlocked!";
  }

  if (food > 2000) {
    return "🍔 Food spending is getting high lately.";
  }

  if (shopping > 3000) {
    return "🛍 Your shopping era is active 😭";
  }

  if (gaming > 1500) {
    return "🎮 Gamer mode detected.";
  }

  if (total > 5000) {
    return "💸 Budget alert bestie.";
  }

  return "✨ Your spending habits are balanced today.";
}