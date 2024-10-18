<template>
    <div>
      <button @click="handleDelete" class="bg-red-500 text-white p-2">Delete User</button>
    </div>
  </template>
  
  <script setup>
  import { deleteUser } from '../lib/fetchUtils';
  
  const handleDelete = async (id) => {
    await deleteUser(id);
    alert('User deleted successfully!');
  };
  </script>
  