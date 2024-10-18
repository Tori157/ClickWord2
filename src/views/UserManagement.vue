<template>
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-6">User Management</h1>
      <CreateUser @user-created="fetchUsers" />
      <UserList @edit-user="setEditingUser" @delete-user="handleDeleteUser" />
      <EditUser v-if="editingUser" :user="editingUser" @user-updated="fetchUsers" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import CreateUser from './CreateUser.vue';
  import UserList from './UserList.vue';
  import EditUser from './EditUser.vue';
  import { getUsers, deleteUser } from '../lib/fetchUtils';
  
  const editingUser = ref(null);
  
  const fetchUsers = async () => {
    // Load users from API
  };
  
  const setEditingUser = (user) => {
    editingUser.value = user;
  };
  
  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    await fetchUsers(); // Reload user list after deletion
  };
  </script>
  