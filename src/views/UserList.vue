<template>
    <div>
      <h2 class="text-2xl mb-4">User List</h2>
      <ul>
        <li v-for="user in users" :key="user.id" class="border-b py-2">
          {{ user.id }} - {{ user.token }}
          <button @click="$emit('edit-user', user)" class="ml-4 text-blue-500">Edit</button>
          <button @click="$emit('delete-user', user.id)" class="ml-2 text-red-500">Delete</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getUsers } from '../lib/fetchUtils';
  
  const users = ref([]);
  
  onMounted(async () => {
    users.value = await getUsers();
  });
  </script>
  