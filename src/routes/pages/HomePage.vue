<script setup>
import playButton from '../../../public/assets/icons/play.png';
import bulb from '../../../public/assets/icons/bulb.png';
import prize from '../../../public/assets/icons/prize.png';

const titleGame1 = ['c', 'l', 'i', 'c', 'k'];
const titleGame2 = ['w', 'o', 'r', 'd'];
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

    <button @click="navigateTo(PAGE_NAME.MODE), playClickButtonSound(), playBackgroundMusic()">
      <img
        :src="playButton"
        alt="Play Button"
        class="lg:w-60 lg:h-60 md:w-36 md:h-36 mx-auto mb-[50px] mt-10 transition duration-300 ease-in-out transform hover:scale-110"
      />
    </button>
    <div class="flex gap-80 mt-10">
      <div class="flex flex-col item-center gap-2">
        <img :src="prize" alt="Prize" class="w-20 h-20 md:w-16 md:h-16 mx-auto my-auto mb-1" />
        <h3 class="bg-[#19C3B2] text-[#FEF9EF] text-[20px] rounded-2xl p-3">Success ({{ Math.round(success) }}%)</h3>
      </div>
      <div class="flex flex-col item-center gap-2">
        <img :src="bulb" alt="Bulb Button" class="w-20 h-20 md:w-16 md:h-16 mx-auto mb-1" />
        <h3 class="bg-[#FF9090] text-[#FEF9EF] text-[20px] rounded-2xl p-3">Hints ({{ hints }})</h3>
      </div>
    </div>
  </div>
</template>
