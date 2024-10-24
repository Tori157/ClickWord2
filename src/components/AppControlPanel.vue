<script setup>
import helpButton from '/assets/icons/helpButton.png';
import settingButton from '/assets/icons/settingButton.png';

import coinDisplay from '/assets/icons/coin.png';
import { useCoinStore } from '@/stores';
import marketButton from '/assets/icons/MarketButton.png';

defineProps({
  openModal: {
    type: Function,
    required: true,
  },
});

const coinStore = useCoinStore();
</script>
A
<template>
  <div id="app-control-panel" class="z-50 fixed top-0 right-0">
    <div class="flex flex-col items-end">
      <div class="flex items-center space-x-2 mr-4 mt-4">
        <img
          :src="coinDisplay"
          alt="Coin Icon"
          class="w-[45px] h-[45px] transition duration-300 ease-in-out transform hover:scale-110"
        />
        <span class="text-3xl text-black font-bold">
          {{ coinStore.formattedCoin }}
        </span>
      </div>
      <button @click="openModal('market')">
        <img
          :src="marketButton"
          alt="Market Button"
          class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>
      <button @click="openModal('tutorial')">
        <img
          :src="helpButton"
          alt="Help Button"
          class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>

      <button @click="openModal('sound')">
        <img
          :src="settingButton"
          alt="setting Button"
          class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>
    </div>
  </div>
</template>
