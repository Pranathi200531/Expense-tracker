<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import Layout from "../components/Layout.vue";

const expenses = ref([]);
const viewType = ref("daily"); // daily | monthly
const selectedDate = ref(new Date().toISOString().slice(0, 7)); // YYYY-MM

let chart;

// 🔹 Fetch expenses
const fetchExpenses = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const res = await fetch(
    `http://localhost:5000/api/expenses?userId=${user._id}`
  );

  expenses.value = await res.json();
  renderChart();
};

// 🔹 Render chart
const renderChart = () => {
  if (!expenses.value.length) return;

  const ctx = document.getElementById("chart");
  if (!ctx) return;

  if (chart) chart.destroy();

  // ✅ DAILY TRACKER (Pie - selected month only)
  if (viewType.value === "daily") {
    const filtered = expenses.value.filter(exp => {
      const expMonth = new Date(exp.createdAt).toISOString().slice(0, 7);
      return expMonth === selectedDate.value;
    });

    if (!filtered.length) return;

    const dateMap = {};

    filtered.forEach(exp => {
      const day = new Date(exp.createdAt).getDate();
      dateMap[day] = (dateMap[day] || 0) + Number(exp.amount);
    });

    chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(dateMap),
        datasets: [{
          label: "Daily Expenses",
          data: Object.values(dateMap)
        }]
      }
    });
  }

  // ✅ MONTHLY TRACKER (Bar - category wise)
  else {
    const categoryMap = {};

    expenses.value.forEach(exp => {
      categoryMap[exp.category] =
        (categoryMap[exp.category] || 0) + Number(exp.amount);
    });

    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(categoryMap),
        datasets: [{
          label: "Category-wise Expenses",
          data: Object.values(categoryMap)
        }]
      }
    });
  }
};

// 🔹 Watch changes
watch(selectedDate, renderChart);
watch(viewType, renderChart);

// 🔹 Load data
onMounted(fetchExpenses);
</script>

<template>
  <Layout>
    <div class="graph-container">
      <h1>📊 Expense Graph</h1>

      <!-- 🔥 Buttons -->
      <div class="controls">
        <button @click="viewType='daily'">📅 Daily Tracker</button>
        <button @click="viewType='monthly'">📊 Monthly Tracker</button>
      </div>

      <!-- 🔥 Month Picker -->
      <div v-if="viewType==='daily'" class="date-picker">
        <label>Select Month:</label>
        <input type="month" v-model="selectedDate" />
      </div>

      <!-- 🔥 Chart -->
      <canvas id="chart"></canvas>

      <p v-if="!expenses.length">No data available</p>
    </div>
  </Layout>
</template>

<style>
.graph-container {
  background: rgba(255,255,255,0.95);
  padding: 25px;
  margin: 40px auto;
  width: 70%;
  border-radius: 15px;
  text-align: center;
}

/* buttons */
.controls {
  margin-bottom: 15px;
}

button {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  padding: 10px 16px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

button:hover {
  transform: scale(1.05);
}

/* date picker */
.date-picker {
  margin: 15px 0;
}

/* chart */
canvas {
  max-width: 500px;
  margin: auto;
}
</style>