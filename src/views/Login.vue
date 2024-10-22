<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6">เข้าสู่ระบบ</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">ชื่อผู้ใช้:</label>
          <input
            v-model="credentials.username"
            type="text"
            class="input input-bordered w-full"
            placeholder="กรอกชื่อผู้ใช้"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">รหัสผ่าน:</label>
          <input
            v-model="credentials.password"
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
        <router-link to="/create-user" class="text-blue-500 hover:underline">สร้างบัญชีใหม่</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser } from '../lib/fetchUtils';

const router = useRouter();
const credentials = ref({ username: '', password: '' });

const handleLogin = async () => {
  try {
    const user = await loginUser(credentials.value);
    localStorage.setItem('currentUser', user.username);
    alert('เข้าสู่ระบบสำเร็จ!');

    // หลังจากล็อกอินสำเร็จ นำทางไปที่หน้า Home
    router.push('/home');
  } catch (error) {
    alert('ไม่สามารถเข้าสู่ระบบได้: ' + error.message);
  }
};
</script>

<style scoped>
/* เพิ่มสไตล์เพิ่มเติมหากจำเป็น */
</style>
