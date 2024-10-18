<script setup>
import { ref } from 'vue';
import PlayButtonIcon from '/public/assets/icons/play.png';
import BulbIcon from '/public/assets/icons/bulb.png';
import TrophyIcon from '/public/assets/icons/prize.png';

const titleGame1 = ['c', 'l', 'i', 'c', 'k'];
const titleGame2 = ['w', 'o', 'r', 'd'];

const success = ref(Number(localStorage.getItem('userSuccess')) ?? 0);
const hints = ref(localStorage.getItem('hint') || 3);
</script>

<template>
  <div class="bg-[#FEF9EF] flex flex-col items-center justify-center h-screen">
    <div
      class="waviy titles text-[#237C9D] text-[40px] md:text-[70px] lg:text-[100px] xl:text-[150px] min-[1440px]:text-[200px] max-[2000px]:text-[200px] mt-[-50px]"
    >
      <div class="flex md:flex-col lg:flex-row justify-center items-center">
        <div class="mx-10">
          <span v-for="(char, index) in titleGame1" :key="index" class="mr-6" :style="`--i: ${index + 1}`">
            {{ char }}
          </span>
        </div>
        <div>
          <span v-for="(char, index) in titleGame2" :key="index" class="mr-6" :style="`--i: ${index + 1}`">
            {{ char }}
          </span>
        </div>
      </div>
    </div>

    <button @click="$router.push({ name: 'menu-page' }), playClickButtonSound(), playBackgroundMusic()">
      <img
        :src="PlayButtonIcon"
        alt="Play Button"
        class="lg:w-60 lg:h-60 md:w-36 md:h-36 mx-auto mb-[50px] mt-10 transition duration-300 ease-in-out transform hover:scale-110"
      />
    </button>
    <div class="flex gap-80 mt-1">
      <div class="flex flex-col item-center gap-2">
        <div class="flex flex-col gap-0">
          <img :src="TrophyIcon" alt="Prize" class="w-20 h-20 md:w-16 md:h-16 mx-auto my-auto mb-1" />
          <h3 class="text-black text-[20px] rounded-2xl p-3 mt-[-10px]">Success ({{ Math.round(success) }}%)</h3>
        </div>
        <button
          @click="$router.push({ name: 'rank-board-page' }), playClickButtonSound(), playBackgroundMusic()"
          class="bg-[#19C3B2] text-[#FEF9EF] text-[20px] rounded-2xl p-3 hover:scale-110"
        >
          Rank Board
        </button>
      </div>
      <div class="flex flex-col item-center gap-2">
        <div class="flex flex-col gap-0">
          <img :src="BulbIcon" alt="Bulb Button" class="w-20 h-20 md:w-16 md:h-16 mx-auto mb-1" />
          <h3 class="text-black text-[20px] rounded-2xl p-3 mt-[-10px]">Hints ({{ hints }})</h3>
        </div>
        <button class="bg-[#FF9090] text-[#FEF9EF] text-[20px] rounded-2xl p-3 hover:scale-110">Market</button>
      </div>
    </div>
  </div>
</template>
