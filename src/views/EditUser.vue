<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores';
import { UserService, AssetService } from '@/services';
import deleteIcon from '/public/assets/icons/delete.png';

const router = useRouter();
const { user, rehydrateUser } = useUserStore();
const editUserFormValues = reactive({
  username: user.username,
  profilePicture: user.profile.avatar,
  profileFrame: user.profile.selectedDecoration,
});

const handleSubmit = async () => {
  await UserService.updateProfile(editUserFormValues);
  router.push({ name: 'home-page' });
};

const handleLogout = () => {
  UserService.signOut();
  router.push({ name: 'login' });
};

const hadleDeleteAccount = async () => {
  //STUB: Show a confirmation dialog before deleting the account
  await UserService.deleteAccount();
  router.push({ name: 'login' });
};

onMounted(async () => {
  await rehydrateUser();
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-[#FEF9EF]">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6">Edit profile</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Username:</label>
          <input
            v-model="editUserFormValues.username"
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
              v-for="(image, index) in AssetService.getBaseProfilePictureUrls()"
              :key="index"
              class="profile-pic cursor-pointer"
              :class="{ selected: editUserFormValues.profilePicture === image }"
              @click="editUserFormValues.profilePicture = image"
            >
              <img :src="image" alt="Profile Picture" class="w-16 h-16 rounded-full border" />
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Choose a profile frame:</label>
          <div v-if="user.profile.decorations?.length" class="flex gap-4">
            <div
              v-for="(frame, index) in user.profile.decorations"
              :key="index"
              class="profile-frame cursor-pointer"
              :class="{ selected: editUserFormValues.profileFrame === frame }"
              @click="editUserFormValues.profileFrame = frame"
            >
              <img :src="frame" alt="Profile Frame" class="w-16 h-16 border" />
            </div>
          </div>
          <div v-else>
            <p class="pt-4 text-gray-500 text-center">You have not purchased any profile frames yet.</p>
          </div>
        </div>

        <div class="flex justify-center items-center gap-4 w-full pt-4">
          <button type="reset" class="btn btn-md w-1/2 !text-lg" @click="$router.push({ name: 'home-page' })">
            Cancel
          </button>
          <button type="submit" class="btn btn-md btn-primary w-1/2 !text-lg">Save</button>
        </div>
      </form>
      <div class="flex justify-center mt-4">
        <button class="pt-4 text-red-500 underline hover:text-red-300 text-lg" @click="handleLogout">Logout</button>
      </div>
    </div>
    <div class="flex justify-center mt-6">
      <button class="btn btn-error text-white text-base" @click="hadleDeleteAccount">
        <img :src="deleteIcon" alt="Delete icon" class="w-[25px] h-[25px] mr-2" />
        Delete my account
      </button>
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
