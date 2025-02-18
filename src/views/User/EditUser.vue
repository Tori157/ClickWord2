<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores';
import { UserService, AssetService } from '@/services';
import deleteIcon from '/assets/icons/delete.png';
import { showAlert } from '@/utils/toast.js';

const router = useRouter();
const { user, rehydrateUser } = useUserStore();
const editUserFormValues = reactive({
  username: user.username,
  profilePicture: user.profile.avatar,
  profileFrame: user.profile.selectedDecoration,
});

const showDeleteConfirmModal = ref(false);
const showLogoutConfirmModal = ref(false); // เพิ่ม modal สำหรับ logout

const handleSubmit = async () => {
  await UserService.updateProfile(editUserFormValues);
  showAlert('Edit success.', 'rgb(25 195 178)');
  router.push({ name: 'home-page' });
};

const handleLogout = () => {
  showLogoutConfirmModal.value = true; // เปิด modal logout
};

const confirmLogout = async () => {
  await UserService.signOut();
  router.push({ name: 'login' });
  // showAlert('Logout success.', 'rgb(239 68 68)');
  setTimeout(() => {
    window.location.reload(true);
  }, 5);
};

const handleDeleteAccount = async () => {
  showDeleteConfirmModal.value = true;
};

const confirmDeleteAccount = async () => {
  await UserService.deleteAccount();
  // showAlert('Delete success.', 'rgb(239 68 68)');
  router.push({ name: 'login' });
  setTimeout(() => {
    window.location.reload(true);
  }, 5);
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

        <!-- Profile Frame Selection -->
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

      <!-- ปุ่ม Logout -->
      <div class="flex justify-center mt-4">
        <button class="pt-4 text-red-500 underline hover:text-red-300 text-lg" @click="handleLogout">Logout</button>
      </div>
    </div>

    <!-- ปุ่ม Delete Account -->
    <div class="flex justify-center mt-6">
      <button class="btn btn-error text-white text-base" @click="handleDeleteAccount">
        <img :src="deleteIcon" alt="Delete icon" class="w-[25px] h-[25px] mr-2" />
        Delete my account
      </button>
    </div>

    <!-- Modal Confirm Logout -->
    <div
      v-if="showLogoutConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      @click.self="showLogoutConfirmModal = false"
    >
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full" @click.stop>
        <h3 class="text-2xl font-bold text-center mb-6">Confirm Logout</h3>
        <p class="text-center text-gray-700 mb-6">Are you sure you want to logout?</p>
        <div class="flex justify-center items-center gap-4">
          <button class="btn btn-md w-1/2 !text-lg" @click="showLogoutConfirmModal = false">Cancel</button>
          <button class="btn btn-md btn-error w-1/2 !text-lg" @click="confirmLogout">Logout</button>
        </div>
      </div>
    </div>

    <!-- Modal Confirm Delete -->
    <div
      v-if="showDeleteConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      @click.self="showDeleteConfirmModal = false"
    >
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full" @click.stop>
        <h3 class="text-2xl font-bold text-center mb-6">Confirm Delete</h3>
        <p class="text-center text-gray-700 mb-6">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <div class="flex justify-center items-center gap-4">
          <button class="btn btn-md w-1/2 !text-lg" @click="showDeleteConfirmModal = false">Cancel</button>
          <button class="btn btn-md btn-error w-1/2 !text-lg" @click="confirmDeleteAccount">Delete</button>
        </div>
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

.modal {
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
