<script setup>
import TurtleIcon from '/public/assets/icons/loadPhoto.png';
import { useCoinStore } from '@/stores/coinStore';
import { ref, computed } from 'vue';

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

const totalTimes = ref(localStorage.getItem('timerHistory') || 0);

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // เพิ่มเลขศูนย์หน้าเมื่อมีค่าต่ำกว่า 10
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

const coinStore = useCoinStore();
const getCoinImage = computed(() => coinStore.getCoinImage);
const showGetCoinImage = computed(() => coinStore.showGetCoinImage);
</script>

<template>
  <div v-if="isOpen" class="modal-container">
    <h2 class="text-white text-7xl mt-5 justify-start">
      {{ `Level ${level[onMode] - 1} completed !` }}
    </h2>
    <h3 class="text-white text-3xl mt-5 justify-end">Total Times: ({{ formatTime(totalTimes) }})</h3>
    <img :src="TurtleIcon" alt="Prize" class="w-[600px] h-[590px] mt-[-60px]" />
    <div v-if="showGetCoinImage" :class="['get-coin', showGetCoinImage ? 'show' : 'hide']">
      <img :src="getCoinImage" alt="Get Coin w-9 h-9" />
    </div>
  </div>
</template>
