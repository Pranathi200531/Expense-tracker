<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Layout from "../components/Layout.vue";
const router = useRouter();
const user = ref(JSON.parse(localStorage.getItem("user")));
const expenses = ref([]);
const amount = ref("");
const category = ref("");
const description = ref("");
const editingId = ref(null);
const query = ref("");
const aiResponse = ref("");



// Fetch data
const fetchExpenses = async () => {
  try {

    
    if (!user.value) return;

    
    const res = await fetch(
      `http://localhost:5000/api/expenses?userId=${user.value._id}`
    );

    const data = await res.json();

    if (Array.isArray(data)) {
      expenses.value = data;
    } else {
      expenses.value = [];
    }

  } catch (err) {
    console.error(err);
  }
};

// delete
const deleteExpense = async (id) => {
  await fetch(`http://localhost:5000/api/expenses/${id}`, {
    method: "DELETE"
  });
  fetchExpenses();
};



// edit
const editExpense = (exp) => {
  amount.value = exp.amount;
  category.value = exp.category;
  description.value = exp.description;
  editingId.value = exp._id;
};

// AI handle query
const handleQuery = () => {
  const search = query.value.toLowerCase();

  if (!search) {
    aiResponse.value = "Type something";
    return;
  }

  // TOTAL
  if (search.includes("total")) {
    const total = expenses.value.reduce((sum, e) => sum + Number(e.amount), 0);
    aiResponse.value = `Total expense: ₹${total}`;
    return;
  }

  // CATEGORY FILTER
  const filtered = expenses.value.filter(exp =>
    exp.category.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    aiResponse.value = "No data found";
    return;
  }

  const total = filtered.reduce((sum, exp) => sum + Number(exp.amount), 0);

  aiResponse.value = `You spent ₹${total} on ${search}`;
};

// add
const addExpense = async () => {
  if (editingId.value) {
    await fetch(`http://localhost:5000/api/expenses/${editingId.value}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        amount: amount.value,
        category: category.value,
        description: description.value,
        userId: user.value._id
      })
    });
    editingId.value = null;
  } else {
    await fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        amount: amount.value,
        category: category.value,
        description: description.value,
         userId: user.value._id 
      })
    });
  }


  fetchExpenses();

  amount.value = "";
  category.value = "";
  description.value = "";
};

onMounted(() => {
  fetchExpenses();
});
</script>

<template>
  <Layout>

    <!-- REMOVE nav (sidebar already has graph button) -->
    
    <div class="container">
      <h1>Expense Tracker</h1>

      <h3>Add Expense</h3>
      <input v-model="amount" placeholder="Amount" />
      <input v-model="category" placeholder="Category" />
      <input v-model="description" placeholder="Description" />
      <button @click="addExpense">Add</button>

      <h3>Ask AI</h3>
      <input v-model="query" placeholder="Ask something..." />
      <button @click="handleQuery">Ask</button>

      <p>{{ aiResponse }}</p>

      <h3>All Expenses</h3>
      <ul>
        <li v-for="exp in expenses" :key="exp._id">
          {{ exp.amount }} - {{ exp.category }} - {{ exp.description }}
          <button @click="editExpense(exp)">Edit</button>
          <button @click="deleteExpense(exp._id)">Delete</button>
        </li>
      </ul>
    </div>

  </Layout>
</template>
<style>
body {
  margin: 0;
  font-family: Arial;
  background: linear-gradient(to right, #1e3c72, #2a5298);
}

.container {
  background: rgba(255,255,255,0.9);
  padding: 20px;
  margin: 30px;
  border-radius: 12px;
}

/* 🔥 NAV BAR */
.nav {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

/* 🔥 BUTTON STYLE */
button {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  padding: 10px 16px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: bold;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

/* 🔥 INPUT STYLE */
input {
  padding: 8px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>