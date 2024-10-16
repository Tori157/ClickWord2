<script setup>
import TrophyIcon from '/public/assets/icons/prizePhoto.png';

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <div v-if="isOpen" class="modal-container">
    <h2 class="text-white text-7xl mt-10">Congratulations !</h2>
    <h2 class="text-white text-2xl mt-10">You success 100% in this game</h2>

    <img :src="TrophyIcon" alt="Prize" class="w-[1500px] h-[800px] items-end mt-[-100px]" />
  </div>
</template>
