<script setup>
import cancelIcon from '@/../public/assets/icons/cancel.png';
import bulbmarket from '@/../public/assets/icons/bulbmarket.png';
import coin from '@/../public/assets/images/coin.png';
// import blueprofile from '@/../public/assets/images/blueprofile.png';
// import greenprofile from '@/../public/assets/images/greenprofile.png';
// import orangeprofile from '@/../public/assets/images/orangeprofile.png';
// import redprofile from '@/../public/assets/images/redprofile.png';

import { useCoinStore, useHintStore } from '@/stores';

const coinStore = useCoinStore();
const hintStore = useHintStore();

defineProps({
  isOpenMarket: {
    type: Boolean,
    required: true,
  },
  onCloseMarket: {
    type: Function,
    required: true,
  },
});

const items = [
  { id: 1, name: 'Hint 1', price: 4, type: 'hint', hintAmount: 1, image: bulbmarket },
  { id: 2, name: 'Hint 6', price: 20, type: 'hint', hintAmount: 6, image: bulbmarket },
  // { id: 3, name: 'Blue Profile Frame', price: 10, type: 'profile', image: blueprofile },
  // { id: 4, name: 'Green Profile Frame', price: 12, type: 'profile', image: greenprofile },
  // { id: 5, name: 'Orange Profile Frame', price: 15, type: 'profile', image: orangeprofile },
  // { id: 6, name: 'Red Profile Frame', price: 18, type: 'profile', image: redprofile },
];

const MarketTitle = ['M', 'a', 'r', 'k', 'e', 't'];

const buyItem = (item) => {
  if (coinStore.coin >= item.price) {
    coinStore.decrement(item.price);

    if (item.type === 'hint') {
      hintStore.increment(item.hintAmount);
    }
    console.log(`You bought ${item.name}!`);
    // alert(`You bought ${item.name}!`);
  } else {
    console.log("You don't have enough coins!");
    // alert("You don't have enough coins!");
  }
};
</script>

<template>
  <div v-if="isOpenMarket" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="onCloseMarket"></div>

    <div class="relative w-full max-w-3xl p-6 bg-[#FEF9EF] rounded-lg shadow-lg">
      <!-- Market Title -->
      <div class="waviy titles text-center text-[100px] text-[#237C9D]">
        <span v-for="(char, index) in MarketTitle" :key="index" class="mr-6" :style="`--i: ${index + 1}`">
          {{ char }}
        </span>
      </div>

      <!-- Close Button -->
      <button class="absolute top-3 left-3 text-gray-600 hover:text-gray-800" @click="onCloseMarket">
        <img
          :src="cancelIcon"
          alt="Close Button"
          class="w-[50px] h-[50px] transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>

      <!-- Coin and Balance -->
      <div class="flex items-end mb-6 absolute top-3 right-3">
        <img :src="coin" alt="coin" class="w-9 h-9 mb-1 mr-2" />
        <span class="text-3xl text-black font-bold mr-3 mb-1">
          {{ coinStore.formattedCoin() }}
        </span>
        <img :src="bulbmarket" alt="coin" class="w-9 h-9 mb-1 mr-2" />
        <span class="text-3xl text-black font-bold mb-1"> {{ hintStore.hint }} </span>
      </div>

      <!-- Items Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <!-- Item Card -->
        <div v-for="item in items" :key="item.id" class="bg-gray-200 rounded-lg p-4 flex flex-col items-center">
          <img :src="item.image" alt="item" class="w-16 h-16 mb-3" />
          <h3 class="text-2xl text-center flex-grow text-black">{{ item.name }}</h3>
          <span class="text-2xl text-black">
            {{ item.price }} <img :src="coin" alt="coin" class="inline w-6 h-6 mb-1" />
          </span>
          <button
            class="mt-2 px-4 py-2 bg-green-500 text-white rounded transition duration-300 ease-in-out transform hover:scale-110"
            @click="buyItem(item)"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
