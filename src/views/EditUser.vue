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
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">password:</label>
          <input
            v-model="user.password"
            type="password"
            class="input input-bordered w-full"
            placeholder="Enter password"
          />
        </div> -->

        <!-- Profile Picture Selection -->
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

        <button type="submit" class="btn btn-primary w-full mt-4">save</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchUser, updateUser, deleteUser } from '../lib/fetchUtils'; // Ensure deleteUser is imported
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const user = ref({ username: '', password: '', profileImage: '' });
const selectedImage = ref('');

// Profile images array
const profileImages = [
  '/assets/profile-pics/profile1.png',
  '/assets/profile-pics/profile2.png',
  '/assets/profile-pics/profile3.png',
  '/assets/profile-pics/profile4.png',
];

// Fetch user data on component mount
onMounted(async () => {
  const username = route.params.username;
  const fetchedUser = await fetchUser(username);
  user.value = fetchedUser;
  selectedImage.value = fetchedUser.profileImage;
});

// Profile picture selection
const selectImage = (image) => {
  selectedImage.value = image;
};

// Update user information
const handleUpdateUser = async () => {
  if (!selectedImage.value) {
    alert('Please select a profile picture');
    return;
  }

  try {
    user.value.profileImage = selectedImage.value;
    await updateUser(user.value);
    alert('Updated successfully!');
    router.push('/home');
  } catch (error) {
    alert('Unable to update information: ' + error.message);
  }
};
</script>

<style scoped>
.profile-pic img {
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.profile-pic.selected img {
  border-color: #007bff;
}
</style>
