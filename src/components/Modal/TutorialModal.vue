<script setup>
import { ref } from 'vue';

import helppage1 from '@/../public/assets/images/helppage1.webp';
import helppage2 from '@/../public/assets/images/helppage2.webp';
import helppage3 from '@/../public/assets/images/helppage3.webp';
import helppage4 from '@/../public/assets/images/helppage4.webp';
import helppage5 from '@/../public/assets/images/helppage5.webp';
import helppage6 from '@/../public/assets/images/helppage6.webp';
import helppage7 from '@/../public/assets/images/helppage7.webp';
import nextLeftIcon from '@/../public/assets/icons/nextlefticon.png';
import nextRightIcon from '@/../public/assets/icons/nextrighticon.png';
import cancelIcon from '@/../public/assets/icons/cancel.png';

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

const currentTutorialPage = ref(0);
const helpPages = [helppage1, helppage2, helppage3, helppage4, helppage5, helppage6, helppage7];

const nextPage = () => {
  if (currentTutorialPage.value < helpPages.length - 1) {
    currentTutorialPage.value++;
  }
};

const prevPage = () => {
  if (currentTutorialPage.value > 0) {
    currentTutorialPage.value--;
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="onClose"></div>
    <div class="relative w-full max-w-3xl p-6 bg-[#FEF9EF] rounded-lg shadow-lg">
      <button class="absolute top-3 right-3 text-gray-600 hover:text-gray-800" @click="onClose">
        <img
          :src="cancelIcon"
          alt="Close Button"
          class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>
      <div class="flex items-center justify-between">
        <button
          :disabled="currentTutorialPage === 0"
          :class="currentTutorialPage > 0 ? '' : 'invisible'"
          class="p-2 transition duration-300 ease-in-out transform hover:scale-110"
          @click="prevPage"
        >
          <img :src="nextLeftIcon" alt="Previous" class="w-10 h-10" />
        </button>
        <div class="flex justify-center items-center w-[500px] h-auto">
          <img :src="helpPages[currentTutorialPage]" alt="Help Page" class="w-full h-auto" />
        </div>
        <button
          :disabled="currentTutorialPage === helpPages.length - 1"
          :class="currentTutorialPage < helpPages.length - 1 ? '' : 'invisible'"
          class="p-2 transition duration-300 ease-in-out transform hover:scale-110"
          @click="nextPage"
        >
          <img :src="nextRightIcon" alt="Next" class="w-10 h-10" />
        </button>
      </div>
    </div>
  </div>
</template>
