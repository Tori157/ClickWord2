<script setup>
import TurtleIcon from '/public/assets/icons/loadPhoto.png';
import { ref, watchEffect, toRefs } from 'vue';
import { useUserStore, useCoinStore } from '@/stores';

const props = defineProps({
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

// ใช้ toRefs เพื่อให้สามารถเข้าถึง props ได้ในแบบ reactive
const { isOpen } = toRefs(props);
const totalTimes = ref(0);

const userStore = useUserStore();
const coinStore = useCoinStore();

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Watch for changes when modal is opened
watchEffect(() => {
  if (isOpen.value) {
    totalTimes.value = userStore.user.gameStats.playDuration;
  }
});
</script>

<template>
  <div v-if="isOpen" class="modal-container">
    <h2 class="text-white text-7xl mt-5 justify-start">
      {{ `Level ${level[onMode] - 1} completed !` }}
    </h2>
    <h3 class="text-white text-3xl mt-5 justify-end">Total Times: ({{ formatTime(totalTimes) }})</h3>
    <img :src="TurtleIcon" alt="Prize" class="w-[600px] h-[590px] mt-[-60px]" />
    <div
      v-if="coinStore.shouldDisplayReceivedCoin"
      :class="['get-coin', coinStore.shouldDisplayReceivedCoin ? 'show' : 'hide']"
    >
      <img :src="coinStore.receivedCoinImagePath" alt="Get Coin w-9 h-9" />
    </div>
  </div>
</template>
