<script setup>
import PlayButtonIcon from '/assets/icons/play.png';
import BulbIcon from '/assets/icons/bulb.png';
import TimeIcon from '/assets/icons/clock.png';
import Ranking from '/assets/icons/ranking.png';
import TrophyIcon from '/assets/icons/prize.png';
import { useUserStore, useHintStore, useSoundPlayerStore } from '@/stores';

const titleGame1 = ['c', 'l', 'i', 'c', 'k'];
const titleGame2 = ['w', 'o', 'r', 'd'];

const userStore = useUserStore();
const hintStore = useHintStore();
const { playSound } = useSoundPlayerStore();

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
    <button
      class="fixed top-5 left-5 flex flex-col items-start mb-5"
      @click="$router.push({ name: 'edit-user', params: { username: userStore.user.username } })"
    >
      <div class="relative">
        <img
          v-if="userStore.user.profile.selectedDecoration"
          :src="userStore.user.profile.selectedDecoration"
          alt="Profile Frame"
          :style="{ width: '100px', height: '100px' }"
          class="absolute shadow-lg rounded-full transition duration-300 ease-in-out transform hover:scale-125 z-0"
        />
        <img
          v-if="userStore.user.profile.avatar"
          :src="userStore.user.profile.avatar"
          alt="Profile Picture"
          :style="{ width: '100px', height: '100px' }"
          class="rounded-full shadow-lg mb-3 transition duration-300 ease-in-out transform hover:scale-110 z-10"
        />
      </div>
      <div class="w-full mt-4 py-1 px-3 bg-black text-white text-lg rounded-lg shadow-sm">
        {{ userStore.user.username }}
      </div>
    </button>

    <div
      class="waviy titles text-[#237C9D] text-[30px] md:text-[50px] lg:text-[80px] xl:text-[100px] min-[1440px]:text-[160px] max-[2000px]:text-[150px] mt-[-50px]"
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

    <button @click="$router.push({ name: 'menu-page' }), playSound('baseClick', { reset: true })">
      <img
        :src="PlayButtonIcon"
        alt="Play Button"
        class="lg:w-[300px] lg:h-[300px] md:w-36 md:h-36 mx-auto mb-[30px] transition duration-300 ease-in-out transform hover:scale-110"
        @click="playSound('bgMusic', { loop: true })"
      />
    </button>
    <button
      class="bg-[#19C3B2] text-[#FEF9EF] flex text-[20px] rounded-2xl p-3 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
      @click="$router.push({ name: 'rank-board-page' }), playSound('baseClick', { reset: true })"
    >
      <img :src="Ranking" alt="Rank icon" class="w-[30px] h-[30px] mr-2" />
      Rank Board
    </button>

    <div class="flex gap-48 mt-12">
      <div class="flex flex-col item-center gap-2">
        <div class="flex flex-col gap-0">
          <img :src="TrophyIcon" alt="Prize" class="w-20 h-20 md:w-16 md:h-16 mx-auto my-auto mb-1" />
          <h3 class="text-black text-[20px] rounded-2xl p-3 mt-[-10px]">
            Success ({{ Math.round(userStore.user.gameStats.completedPercentage) }}%)
          </h3>
        </div>
      </div>
      <div class="flex flex-col item-center gap-2">
        <div class="flex flex-col gap-0">
          <img :src="TimeIcon" alt="Time Button" class="w-20 h-20 md:w-16 md:h-16 mx-auto mb-1" />
          <h3 class="text-black text-[20px] rounded-2xl p-3 mt-[-10px]">
            Times ({{ formatTime(userStore.user.gameStats.playDuration) }})
          </h3>
        </div>
      </div>
      <div class="flex flex-col item-center gap-2">
        <div class="flex flex-col gap-0">
          <img :src="BulbIcon" alt="Bulb Button" class="w-20 h-20 md:w-16 md:h-16 mx-auto mb-1" />
          <h3 class="text-black text-[20px] rounded-2xl p-3 mt-[-10px]">Hints ({{ hintStore.hints }})</h3>
        </div>
      </div>
    </div>
  </div>
</template>
