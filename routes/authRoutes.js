const express = require("express");
const router = express.Router();
const User = require("../models/User");


// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("SIGNUP DATA:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Signup error" });
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN DATA:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;