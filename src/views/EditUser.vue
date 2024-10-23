<script setup>
import { ref, onMounted } from 'vue';
import { fetchUser, updateUser, deleteUser } from '../lib/fetchUtils'; // Ensure deleteUser is imported
import { useRoute, useRouter } from 'vue-router';
import { useProfileStore } from '@/stores/profileStore';
const route = useRoute();
const router = useRouter();
const user = ref({ username: '', password: '', profileImage: '', profileFrame: '' });
const selectedImage = ref('');
const selectedFrame = ref('');
// Logout function
function logout() {
  localStorage.clear(); // Clear all data in localStorage
  router.push({ name: 'login' }); // Redirect to 'Login'
}

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
  selectedFrame.value = fetchedUser.profileFrame;
});

// Profile picture selection
const selectImage = (image) => {
  selectedImage.value = image;
};

const selectFrame = (frame) => {
  selectedFrame.value = frame;
};

// Update user information
const handleUpdateUser = async () => {
  if (!selectedImage.value) {
    alert('Please select a profile picture');
    return;
  }

  try {
    user.value.profileImage = selectedImage.value;
    user.value.profileFrame = selectedFrame.value;
    await updateUser(user.value);
    alert('Updated successfully!');
    router.push('/home');
  } catch (error) {
    alert('Unable to update information: ' + error.message);
  }
};

// Cancel function to go back to home
function cancel() {
  router.push('/home');
}

// Delete user account
const handleDeleteUser = async () => {
  const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
  if (confirmDelete) {
    try {
      await deleteUser(user.value.username); // Call the delete function with the username
      alert('Account deleted successfully!');
      router.push({ name: 'login' }); // Redirect to the login page after deletion
    } catch (error) {
      alert('Unable to delete account: ' + error.message);
    }
  }
};

const profileStore = useProfileStore();
const profileFrames = ref([]);
onMounted(() => {
  profileFrames.value = profileStore.purchasedFrames;
  console.log(profileStore.profileFrames);
});
</script>

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

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Choose a profile frame:</label>
          <div class="flex gap-4">
            <div
              v-for="(frame, index) in profileFrames"
              :key="index"
              class="profile-frame cursor-pointer"
              :class="{ selected: selectedFrame === frame }"
              @click="selectFrame(frame)"
            >
              <img :src="frame" alt="Profile Frame" class="w-16 h-16 border" />
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-full mt-4">Save</button>
        <button @click="cancel()" class="btn w-full mt-4">Cancel</button>
      </form>
      <div class="flex justify-center mt-4">
        <button @click="logout()" class="text-red-500 underline hover:text-red-300">Logout</button>
      </div>

      <!-- Delete User Button -->
      <div class="flex justify-center mt-4">
        <button @click="handleDeleteUser" class="text-red-500 underline hover:text-red-300">Delete Account</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-pic img,
.profile-frame img {
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.profile-pic.selected img,
.profile-frame.selected img {
  border-color: #007bff;
}
</style>
