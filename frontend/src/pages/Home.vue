<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="container">
    <h1>Welcome to Expense Tracker</h1>

    <button @click="router.push('/login')">Login</button>
    <button @click="router.push('/signup')">Signup</button>
  </div>
</template>