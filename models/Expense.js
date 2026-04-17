const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  description: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Expense", expenseSchema);