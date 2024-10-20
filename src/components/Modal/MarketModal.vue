<script setup>
import cancelIcon from '@/../public/assets/icons/cancel.png';
import bulbmarket from '@/../public/assets/icons/bulbmarket.png';
import coin from '@/../public/assets/images/coin.png';
import blueprofile from '@/../public/assets/images/blueprofile.png';
import greenprofile from '@/../public/assets/images/greenprofile.png';
import orangeprofile from '@/../public/assets/images/orangeprofile.png';
import redprofile from '@/../public/assets/images/redprofile.png';

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
  { id: 1, name: 'Hint 1', price: 4, image: bulbmarket },
  { id: 6, name: 'Hint 6', price: 20, image: bulbmarket },
  { id: 2, name: 'Blue Profile Frame', price: 10, image: blueprofile },
  { id: 3, name: 'Green Profile Frame', price: 12, image: greenprofile },
  { id: 4, name: 'Orange Profile Frame', price: 15, image: orangeprofile },
  { id: 5, name: 'Red Profile Frame', price: 18, image: redprofile },
];
</script>

<template>
  <div v-if="isOpenMarket" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="onCloseMarket"></div>

    <div class="relative w-full max-w-3xl p-6 bg-[#FEF9EF] rounded-lg shadow-lg">
      <!-- Market Title -->
      <div class="titles text-center text-[100px] text-[#237C9D]">
        <h1>MarKet</h1>
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
      <div class="flex flex-col items-end mb-6 absolute top-3 right-3">
        <img :src="coin" alt="coin" class="w-12 h-12 mb-1 mr-2" />
        <span class="text-3xl font-bold ml-2">123 $</span>
      </div>

      <!-- Items Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <!-- Item Card -->
        <div v-for="item in items" :key="item.id" class="bg-gray-200 rounded-lg p-4 flex flex-col items-center">
          <img :src="item.image" alt="item" class="w-16 h-16 mb-2" />
          <h3 class="text-2xl text-center flex-grow text-black">{{ item.name }}</h3>
          <span class="text-lg font-bold text-3xl text-black">
            {{ item.price }} <img :src="coin" alt="coin" class="inline w-4 h-4" />
          </span>
          <button
            class="mt-2 px-4 py-2 bg-green-500 text-white rounded transition duration-300 ease-in-out transform hover:scale-110"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap');

h1 {
  font-family: 'Irish Grover', sans-serif;
  font-weight: 500;
  font-style: normal;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-right: 5px;
  letter-spacing: 5px;
}
</style>
