<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { UserService, AssetService } from '@/services';
import { showAlert } from '@/utils/toast.js';

const router = useRouter();
const signupFormValues = reactive({
  username: '',
  password: '',
  profilePicture: AssetService.getDefaultProfilePictureUrl(),
});

const handleCreateUser = async () => {
  await UserService.signUp(signupFormValues);
  router.push({ name: 'home-page' });
  showAlert('Create success.', 'rgb(25 195 178)');
  setTimeout(() => {
    window.location.reload(true);
  }, 1000);
};
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-[#FEF9EF]">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6">Create a new user</h2>
      <form @submit.prevent="handleCreateUser">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">username:</label>
          <input
            v-model="signupFormValues.username"
            type="text"
            class="input input-bordered w-full"
            minlength="3"
            maxlength="15"
            placeholder="Enter username"
          />
        </div>

        <!-- ฟิลด์สำหรับกรอกรหัสผ่าน -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">password:</label>
          <input
            v-model="signupFormValues.password"
            type="password"
            class="input input-bordered w-full"
            minlength="8"
            placeholder="กรอกรหัสผ่าน"
            required
          />
        </div>

        <!-- ส่วนสำหรับเลือกภาพโปรไฟล์ -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Choose a profile picture:</label>
          <div class="flex gap-4">
            <div
              v-for="(image, index) in AssetService.getBaseProfilePictureUrls()"
              :key="index"
              class="profile-pic cursor-pointer"
              :class="{ selected: signupFormValues.profilePicture === image }"
              @click="signupFormValues.profilePicture = image"
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

<style scoped>
.profile-pic img {
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.profile-pic.selected img {
  border-color: #007bff;
}
</style>
