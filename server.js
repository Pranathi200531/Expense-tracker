require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express(); // ✅ FIRST create app

app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


// ✅ Routes AFTER app is created
const expenseRoutes = require("./routes/expenseRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/expenses", expenseRoutes);
app.use("/api/ai", aiRoutes);

// DB connection

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("DB Connected");

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });

})
.catch(err => {
  console.log("DB Error:", err);
});