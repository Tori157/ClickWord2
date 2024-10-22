<script setup>
import { ref } from 'vue';
import PlayButtonIcon from '/public/assets/icons/play.png';
import BulbIcon from '/public/assets/icons/bulb.png';
import TimeIcon from '/public/assets/icons/clock.png';
import Ranking from '/public/assets/icons/ranking.png';
import TrophyIcon from '/public/assets/icons/prize.png';
import { useHintStore } from '@/stores';
const titleGame1 = ['c', 'l', 'i', 'c', 'k'];
const titleGame2 = ['w', 'o', 'r', 'd'];

const success = ref(Number(localStorage.getItem('userSuccess')) ?? 0);
const hintStore = useHintStore();
// มาเปลี่ยนด้วยนะจุ้บๆ
// const hints = ref(localStorage.getItem('hint') || 3);

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
        class="lg:w-60 lg:h-60 md:w-36 md:h-36 mx-auto mb-[30px] transition duration-300 ease-in-out transform hover:scale-110"
      />
    </button>
    <button
      class="bg-black text-[#FEF9EF] text-[20px] rounded-full px-28 p-1 transition duration-300 ease-in-out transform hover:scale-110"
    >
      UserName
    </button>
    <button
      @click="$router.push({ name: 'rank-board-page' }), playClickButtonSound(), playBackgroundMusic()"
      class="bg-[#19C3B2] text-[#FEF9EF] flex text-[20px] rounded-2xl p-3 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
    >
      <img :src="Ranking" alt="Rank icon" class="w-[30px] h-[30px] mr-2" />
      Rank Board
    </button>
    <div class="flex gap-48 mt-12">
      <div class="flex flex-col item-center gap-2">
        <div class="flex flex-col gap-0">
          <img :src="TrophyIcon" alt="Prize" class="w-20 h-20 md:w-16 md:h-16 mx-auto my-auto mb-1" />
          <h3 class="text-black text-[20px] rounded-2xl p-3 mt-[-10px]">Success ({{ Math.round(success) }}%)</h3>
        </div>
      </div>
      <div class="flex flex-col item-center gap-2">
        <div class="flex flex-col gap-0">
          <img :src="TimeIcon" alt="Time Button" class="w-20 h-20 md:w-16 md:h-16 mx-auto mb-1" />
          <h3 class="text-black text-[20px] rounded-2xl p-3 mt-[-10px]">Times ({{ formatTime(totalTimes) }})</h3>
        </div>
        <!-- <button class="bg-[#FF9090] text-[#FEF9EF] text-[20px] rounded-2xl p-3 hover:scale-110">Market</button> -->
      </div>
      <div class="flex flex-col item-center gap-2">
        <div class="flex flex-col gap-0">
          <img :src="BulbIcon" alt="Bulb Button" class="w-20 h-20 md:w-16 md:h-16 mx-auto mb-1" />
          <h3 class="text-black text-[20px] rounded-2xl p-3 mt-[-10px]">Hints ({{ hintStore.hint }})</h3>
        </div>
        <!-- <button class="bg-[#FF9090] text-[#FEF9EF] text-[20px] rounded-2xl p-3 hover:scale-110">Market</button> -->
      </div>
    </div>
  </div>
</template>
