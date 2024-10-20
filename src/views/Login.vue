<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Define reactive variables using Composition API
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const showCreateUser = ref(false); // State for showing create user form
const users = ref([]); // Store users for login check

// Define the login handler
const handleLogin = () => {
  const existingUser = users.value.find((user) => user.email === email.value && user.password === password.value);
  if (existingUser) {
    alert('Login successful!');
    router.push('/home');
  } else {
    errorMessage.value = 'Invalid email or password';
  }
};

// Define the create user handler
const handleCreateUser = () => {
  if (email.value && password.value) {
    users.value.push({ email: email.value, password: password.value }); // Save new user
    alert('User created successfully!');

    email.value = ''; // Clear fields
    password.value = '';
    showCreateUser.value = false; // Hide form after creation
  } else {
    errorMessage.value = 'Please fill in all fields to create a user.';
  }
};
</script>

<template>
  <div class="bg-[#FEF9EF] flex items-center justify-center h-screen">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-gray-700 text-center">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-[#19C3B2] text-[#FEF9EF] py-2 px-4 rounded hover:bg-[#17A89B] transition-colors"
        >
          Login
        </button>

        <div v-if="errorMessage" class="mt-4 text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>
      </form>

      <div class="text-center mt-4">
        <button @click="showCreateUser = !showCreateUser" class="text-blue-500 hover:underline">
          {{ showCreateUser ? 'Cancel' : 'Create User' }}
        </button>
      </div>

      <div v-if="showCreateUser" class="mt-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-700 text-center">Create User</h2>
        <form @submit.prevent="handleCreateUser">
          <div class="mb-4">
            <label for="newUserEmail" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              id="newUserEmail"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new user email"
              required
            />
          </div>

          <div class="mb-6">
            <label for="newUserPassword" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              id="newUserPassword"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new user password"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* You can add additional styles here if needed */
</style>
