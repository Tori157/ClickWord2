<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6">แก้ไขข้อมูลผู้ใช้</h2>
      <form @submit.prevent="handleUpdateUser">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">ชื่อผู้ใช้:</label>
          <input
            v-model="user.username"
            type="text"
            class="input input-bordered w-full"
            placeholder="กรอกชื่อผู้ใช้"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">รหัสผ่าน:</label>
          <input
            v-model="user.password"
            type="password"
            class="input input-bordered w-full"
            placeholder="กรอกรหัสผ่าน"
          />
        </div>
        <button type="submit" class="btn btn-primary w-full mt-4">บันทึกการเปลี่ยนแปลง</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchUser, updateUser } from '../libs/fetchUtils'; // นำเข้าฟังก์ชันที่จำเป็น
import { useRoute, useRouter } from 'vue-router';

const route = useRoute(); // ใช้เพื่อเข้าถึง route
const router = useRouter();
const user = ref({ username: '', password: '' }); // สร้างตัวแปรเพื่อเก็บข้อมูลผู้ใช้

// ดึงข้อมูลผู้ใช้เมื่อติดตั้งคอมโพเนนต์
onMounted(async () => {
  const username = route.params.username; // ดึง username จาก params
  const fetchedUser = await fetchUser(username); // ดึงข้อมูลผู้ใช้จาก API
  user.value = fetchedUser; // ตั้งค่าผู้ใช้
});

const handleUpdateUser = async () => {
  try {
    await updateUser(user.value); // เรียกใช้ฟังก์ชันเพื่ออัปเดตข้อมูล
    alert('อัปเดตข้อมูลเรียบร้อยแล้ว!');
    router.push('/home'); // นำทางไปยังหน้า Home หลังการอัปเดต
  } catch (error) {
    alert('ไม่สามารถอัปเดตข้อมูลได้: ' + error.message);
  }
};
</script>

<style scoped>
/* เพิ่มสไตล์เพิ่มเติมหากจำเป็น */
</style>
