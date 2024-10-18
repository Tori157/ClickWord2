<template>
  <div>
    <h2 class="text-2xl mb-4">Edit User</h2>
    <form @submit.prevent="handleEditUser">
      <label>User ID:</label>
      <input v-model="user.id" class="border p-2" disabled />
      <label class="ml-4">Token:</label>
      <input v-model="user.token" class="border p-2" />
      <button type="submit" class="ml-4 bg-blue-500 text-white p-2">Update</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { updateUser } from '../lib/fetchUtils';

const user = ref({ id: '', token: '' });

watch(
  () => user,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      user.value = { ...newVal };
    }
  },
  { immediate: true },
);

const handleEditUser = async () => {
  await updateUser(user.value.id, user.value);
  alert('User updated successfully!');
};
</script>
