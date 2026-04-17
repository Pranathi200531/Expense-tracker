<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

const signup = async () => {
  await fetch("http://localhost:5000/api/auth/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  alert("Signup successful");
  router.push("/login");
};
</script>

<template>
  <div class="container">
    <h2>Signup</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="signup">Signup</button>
  </div>
</template>