<template>
    <div>
      <h2 class="text-2xl mb-4">Create New User</h2>
      <form @submit.prevent="handleCreateUser">
        <label>User ID:</label>
        <input v-model="newUser.id" class="border p-2" placeholder="Enter User ID" />
        <label class="ml-4">Token:</label>
        <input v-model="newUser.token" class="border p-2" placeholder="Enter Token" />
        <button type="submit" class="ml-4 bg-green-500 text-white p-2">Create</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { createUser } from '../lib/fetchUtils';
  
  const newUser = ref({ id: '', token: '' });
  
  const handleCreateUser = async () => {
    await createUser(newUser.value);
    newUser.value = { id: '', token: '' };
    alert('User created successfully!');
  };
  </script>
  