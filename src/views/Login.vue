<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import UserService from '@/services/userSercvice';

const router = useRouter();
const loginFormValues = reactive({ username: '', password: '' });

const handleLogin = async () => {
  await UserService.signIn(loginFormValues);
  router.push({ name: 'home-page' });
};
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6">เข้าสู่ระบบ</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">ชื่อผู้ใช้:</label>
          <input
            v-model="loginFormValues.username"
            type="text"
            class="input input-bordered w-full"
            placeholder="กรอกชื่อผู้ใช้"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">รหัสผ่าน:</label>
          <input
            v-model="loginFormValues.password"
            type="password"
            class="input input-bordered w-full"
            placeholder="กรอกรหัสผ่าน"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-full mt-4">เข้าสู่ระบบ</button>
      </form>
      <p class="text-center mt-4">
        ไม่มีบัญชีใช่ไหม?
        <router-link :to="{ name: 'signup' }" class="text-blue-500 hover:underline">สร้างบัญชีใหม่</router-link>
      </p>
    </div>
  </div>
</template>
