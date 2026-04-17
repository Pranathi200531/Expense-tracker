<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("user");
  router.push("/login");
};
</script>

<template>
  <div class="layout">

    <!-- Sidebar -->
    <div class="sidebar">
      <h2>💸 Tracker</h2>

      <button @click="$router.push('/dashboard')">Dashboard</button>
      <button @click="$router.push('/graph')">Graph</button>
      <button @click="logout">Logout</button>
    </div>

    <!-- Page Content -->
    <div class="content">
      <slot></slot>
    </div>

  </div>
</template>

<style>
.layout {
  display: flex;
}

.sidebar {
  width: 200px;
  height: 100vh;
  background: #2c3e50;
  color: white;
  padding: 20px;
}

.sidebar h2 {
  margin-bottom: 20px;
}

.sidebar button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  background: #34495e;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.sidebar button:hover {
  background: #1abc9c;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>