<script setup>
import MarketModal from './Modal/MarketModal.vue';
import helpButton from '/public/assets/icons/helpButton.png';
import soundButton from '/public/assets/icons/soundButton.png';
import marketButton from '/public/assets/icons/MarketButton.png';
import { ref } from 'vue'; // ใช้ ref เพื่อสร้าง state

const isOpenMarket = ref(false); // สร้าง state สำหรับเปิด/ปิด modal

const openMarketModal = () => {
  isOpenMarket.value = true;
};

const closeMarketModal = () => {
  isOpenMarket.value = false;
};
defineProps({
  openTutorialModal: {
    type: Function,
    required: true,
  },
});
</script>
A
<template>
  <div id="app-control-panel" class="z-50 absolute top-0 right-0">
    <div class="flex flex-col">
      <button @click="openMarketModal">
        <img
          :src="marketButton"
          alt="Market Button"
          class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>
      <button @click="openTutorialModal">
        <img
          :src="helpButton"
          alt="Help Button"
          class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>

      <button @click="toggleSound()">
        <img
          :src="soundButton"
          alt="Sound Button"
          class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>
    </div>
  </div>
  <MarketModal :isOpenMarket="isOpenMarket" :onCloseMarket="closeMarketModal" />
</template>
