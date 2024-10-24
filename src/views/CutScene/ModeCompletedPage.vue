<script setup>
import StarIcon from '/assets/icons/level-up-photo.png';
import PlayIcon from '/assets/icons/continue.png';

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  onMode: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div v-if="isOpen" class="modal-container">
    <h2 class="text-white text-7xl mt-10">
      {{ `Finished Mode ${onMode.charAt(0).toUpperCase() + onMode.slice(1)}` }}
    </h2>
    <img :src="StarIcon" alt="Prize" class="w-[410px] h-[400px] items-end mt-[-10px]" />
    <button class="hover:scale-150" @click="$router.push({ name: 'menu-page' })">
      <img :src="PlayIcon" alt="Continue" class="w-[150px] h-[150px] items-end mt-[-100px] hover:scale-110" />
    </button>
    <h2 class="text-white text-4xl mb-[60px] justify-end">You have received 5 additional hint!</h2>
  </div>
</template>
