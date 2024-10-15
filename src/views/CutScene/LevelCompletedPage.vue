<script setup>
import TurtleIcon from '/public/assets/icons/loadPhoto.png';

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  level: {
    type: Object,
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
    <h2 class="text-white text-7xl mt-10 justify-start">
      {{ `Level ${level[onMode] - 1} completed !` }}
    </h2>
    <img :src="TurtleIcon" alt="Prize" class="w-[610px] h-[600px] items-end" />
  </div>
</template>
