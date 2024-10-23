<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6">Create a new user</h2>
      <form @submit.prevent="handleCreateUser">
        <!-- ฟิลด์สำหรับกรอกชื่อผู้ใช้ -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">username:</label>
          <input
            v-model="newUser.username"
            type="text"
            class="input input-bordered w-full"
            placeholder="Enter username"
            required
          />
        </div>

        <!-- ฟิลด์สำหรับกรอกรหัสผ่าน -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">password:</label>
          <input
            v-model="newUser.password"
            type="password"
            class="input input-bordered w-full"
            placeholder="Enter password"
            required
          />
        </div>

        <!-- ส่วนสำหรับเลือกภาพโปรไฟล์ -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Choose a profile picture:</label>
          <div class="flex gap-4">
            <div
              v-for="(image, index) in profileImages"
              :key="index"
              class="profile-pic cursor-pointer"
              :class="{ selected: selectedImage === image }"
              @click="selectImage(image)"
            >
              <img :src="image" alt="Profile Picture" class="w-16 h-16 rounded-full border" />
            </div>
          </div>
        </div>

        <!-- ปุ่มสร้างผู้ใช้ -->
        <button type="submit" class="btn btn-primary w-full mt-4">Create a user</button>
      </form>

      <p class="text-center mt-4">
        Already have an account?
        <router-link to="/" class="text-blue-500 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createUser } from '../lib/fetchUtils';

// สร้าง state สำหรับชื่อผู้ใช้, รหัสผ่าน, และภาพโปรไฟล์
const newUser = ref({ username: '', password: '', profileImage: '' });
const selectedImage = ref(''); // เก็บภาพโปรไฟล์ที่ผู้ใช้เลือก

// ตัวเลือกภาพโปรไฟล์ที่ให้ผู้ใช้เลือก
const profileImages = [
  '/assets/profile-pics/profile1.png',
  '/assets/profile-pics/profile2.png',
  '/assets/profile-pics/profile3.png',
  '/assets/profile-pics/profile4.png',
];

// ฟังก์ชันเลือกภาพโปรไฟล์
const selectImage = (image) => {
  selectedImage.value = image;
};

// ฟังก์ชันสร้างผู้ใช้ใหม่
const handleCreateUser = async () => {
  if (!selectedImage.value) {
    alert('Please select a profile picture');
    return;
  }

  try {
    // เพิ่มรูปโปรไฟล์เข้าไปในข้อมูลผู้ใช้
    newUser.value.profileImage = selectedImage.value;

    await createUser(newUser.value);
    alert('created successfully!');
    newUser.value = { username: '', password: '', profileImage: '' }; // รีเซ็ตฟิลด์
    selectedImage.value = ''; // รีเซ็ตการเลือกภาพ
  } catch (error) {
    alert('Unable to create user: ' + error.message);
  }
};
</script>

<style scoped>
/* สไตล์เพิ่มเติมสำหรับการเลือกภาพ */
.profile-pic img {
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.profile-pic.selected img {
  border-color: #007bff;
}
</style>
