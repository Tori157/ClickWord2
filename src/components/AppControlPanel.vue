<script setup>
import MarketModal from './Modal/MarketModal.vue';
import helpButton from '/public/assets/icons/helpButton.png';
import soundButton from '/public/assets/icons/soundButton.png';

import coinDisplay from '/public/assets/icons/coin.png';
import { useCoinStore } from '@/stores';
import marketButton from '/public/assets/icons/MarketButton.png';
import { ref } from 'vue';

const isOpenMarket = ref(false);
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

const coinStore = useCoinStore();
</script>
A
<template>
  <div id="app-control-panel" class="z-50 absolute top-0 right-0">
    <div class="flex flex-col">
      <div class="flex items-center space-x-2 mr-4 mt-4">
        <img
          :src="coinDisplay"
          alt="Coin Icon"
          class="w-[50px] h-[50px] transition duration-300 ease-in-out transform hover:scale-110"
        />
        <span class="text-4xl text-black font-bold">
          {{ coinStore.formattedCoin() }}
        </span>
      </div>
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
