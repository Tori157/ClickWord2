<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import UserService from '@/services/userSercvice';

const router = useRouter();
const loginFormValues = reactive({ username: '', password: '' });

const handleLogin = async () => {
  await UserService.signIn(loginFormValues);
  router.push({ name: 'home-page' });
  setTimeout(() => {
    window.location.reload(true);
  }, 1000);
}
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-[#FEF9EF]">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">username:</label>
          <input
            v-model="loginFormValues.username"
            type="text"
            class="input input-bordered w-full"
            placeholder="Enter username"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">password:</label>
          <input
            v-model="loginFormValues.password"
            type="password"
            class="input input-bordered w-full"
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-full mt-4">Login</button>
      </form>
      <p class="text-center mt-4">
        Don't have an account?
        <router-link :to="{ name: 'signup' }" class="text-blue-500 hover:underline">Create a new account</router-link>
      </p>
    </div>
  </div>
</template>
