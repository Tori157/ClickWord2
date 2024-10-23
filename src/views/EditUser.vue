<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6">Edit profile</h2>
      <form @submit.prevent="handleUpdateUser">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Username:</label>
          <input
            v-model="user.username"
            type="text"
            class="input input-bordered w-full"
            placeholder="Enter username"
            required
          />
        </div>
        <!-- <div class="mb-4">
          <label class="block text-sm font-medium mb-1">password:</label>
          <input
            v-model="user.password"
            type="password"
            class="input input-bordered w-full"
            placeholder="Enter password"
          />
        </div> -->

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

        <button type="submit" class="btn btn-primary w-full mt-4 text-md">Save</button>
                <button type="submit" class="btn w-full mt-4 text-md" @click="cancel()">Cancle</button>

      </form>
      <!-- ปุ่ม Logout อยู่ตรงกลาง -->
      <div class="flex justify-center mt-4">
        <button @click="logout()" class="text-red-500 underline hover:text-red-300">Logout</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchUser, updateUser } from '../lib/fetchUtils';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const user = ref({ username: '', password: '', profileImage: '' });
const selectedImage = ref(''); // เก็บภาพโปรไฟล์ที่เลือก

// ตัวเลือกภาพโปรไฟล์ที่ให้ผู้ใช้เลือก
const profileImages = [
  '/assets/profile-pics/profile1.png',
  '/assets/profile-pics/profile2.png',
  '/assets/profile-pics/profile3.png',
  '/assets/profile-pics/profile4.png',
];

// ดึงข้อมูลผู้ใช้เมื่อติดตั้งคอมโพเนนต์
onMounted(async () => {
  const username = route.params.username; // ดึง username จาก params
  const fetchedUser = await fetchUser(username); // ดึงข้อมูลผู้ใช้จาก API
  user.value = fetchedUser; // ตั้งค่าผู้ใช้
  selectedImage.value = fetchedUser.profileImage; // ตั้งค่า selectedImage ให้เป็นภาพโปรไฟล์ปัจจุบัน
});

// ฟังก์ชันเลือกภาพโปรไฟล์
const selectImage = (image) => {
  selectedImage.value = image;
};

// ฟังก์ชันการอัปเดตผู้ใช้
const handleUpdateUser = async () => {
  if (!selectedImage.value) {
    alert('Please select a profile picture');
    return;
  }

  try {
    // เพิ่มรูปโปรไฟล์เข้าไปในข้อมูลผู้ใช้
    user.value.profileImage = selectedImage.value;

    await updateUser(user.value); // เรียกใช้ฟังก์ชันเพื่ออัปเดตข้อมูล
    alert('updated successfully!');
    router.push('/home'); // นำทางไปยังหน้า Home หลังการอัปเดต
  } catch (error) {
    alert('Unable to update information: ' + error.message);
  }
};

// ฟังก์ชัน Cancel กลับไปหน้า home
function cancel() {
  router.push('/home');
}

function logout() {
  localStorage.clear(); // ล้างข้อมูลทั้งหมดใน localStorage
  router.push({ name: 'login' }); // เปลี่ยนหน้าไปยัง 'Login'
}
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
