const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { query, expenses } = req.body;

    console.log("AI Request:", query);

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful expense assistant."
        },
        {
          role: "user",
          content: `User question: ${query}. Data: ${JSON.stringify(expenses)}`
        }
      ]
    });

    const reply = response.choices[0].message.content;

    res.json({ answer: reply });

  } catch (error) {
  console.log("AI ERROR:", error.message);

  // ✅ fallback logic
  const { query, expenses } = req.body;
  const q = query.toLowerCase();

  if (q.includes("total")) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return res.json({ answer: `Total expense is ₹${total}` });
  }

  if (q.includes("food")) {
    const filtered = expenses.filter(e => e.category.toLowerCase() === "food");
    return res.json({ answer: `You have ${filtered.length} food expenses` });
  }

  return res.json({ answer: "AI not available. Try: total, food" });
}
});

module.exports = router;