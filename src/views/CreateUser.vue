<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6">สร้างผู้ใช้ใหม่</h2>
      <form @submit.prevent="handleCreateUser">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">ชื่อผู้ใช้:</label>
          <input 
            v-model="newUser.username" 
            type="text" 
            class="input input-bordered w-full" 
            placeholder="กรอกชื่อผู้ใช้" 
            required 
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">รหัสผ่าน:</label>
          <input 
            v-model="newUser.password" 
            type="password" 
            class="input input-bordered w-full" 
            placeholder="กรอกรหัสผ่าน" 
            required 
          />
        </div>
        <button 
          type="submit" 
          class="btn btn-primary w-full mt-4"
        >
          สร้างผู้ใช้
        </button>
      </form>
      <p class="text-center mt-4">
        มีบัญชีอยู่แล้ว? 
        <router-link to="/" class="text-blue-500 hover:underline">เข้าสู่ระบบ</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createUser } from '../lib/fetchUtils';

const newUser = ref({ username: '', password: '' });

const handleCreateUser = async () => {
  try {
    await createUser(newUser.value);
    alert('ผู้ใช้ถูกสร้างสำเร็จ!');
    newUser.value = { username: '', password: '' }; // รีเซ็ตฟิลด์
  } catch (error) {
    alert('ไม่สามารถสร้างผู้ใช้ได้: ' + error.message);
  }
};
</script>

<style scoped>
/* เพิ่มสไตล์เพิ่มเติมหากจำเป็น */
</style>
