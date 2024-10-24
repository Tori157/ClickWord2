<script setup>
import RightArrowIcon from '/assets/icons/back.png';
import { useSoundPlayerStore } from '@/stores';

const { playSound } = useSoundPlayerStore();

const modeGameTitle = ['m', 'o', 'd', 'e'];
</script>

<template>
  <div class="bg-[#FEF9EF] flex flex-col items-center justify-center h-screen gap-16">
    <div class="waviy titles text-[150px] text-[#237C9D]">
      <span v-for="(char, index) in modeGameTitle" :key="index" class="mr-6" :style="`--i: ${index + 1}`">
        {{ char }}
      </span>
    </div>

    <div class="flex flex-col gap-6">
      <button
        class="bg-[#19C3B2] select-mode-btn hover:bg-[#20a396]"
        @click="
          $router.push({ name: 'game-play-page', query: { mode: 'easy' } }), playSound('baseClick', { reset: true })
        "
      >
        Easy
      </button>
      <button
        class="bg-[#FFCB77] select-mode-btn hover:bg-[#ffb031]"
        @click="
          $router.push({ name: 'game-play-page', query: { mode: 'medium' } }), playSound('baseClick', { reset: true })
        "
      >
        Medium
      </button>
      <button
        class="bg-[#FE6D73] select-mode-btn hover:bg-[#ee464c]"
        @click="
          $router.push({ name: 'game-play-page', query: { mode: 'hard' } }), playSound('baseClick', { reset: true })
        "
      >
        Hard
      </button>
      <button @click="$router.push({ name: 'home-page' }), playSound('baseClick', { reset: true })">
        <img
          :src="RightArrowIcon"
          alt="Go back to home page"
          class="w-20 h-20 mx-auto my-auto mb-1 mt-16 transition duration-300 ease-in-out transform hover:scale-150"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.select-mode-btn {
  @apply text-[#FEF9EF] text-[40px] rounded-2xl px-8 transition duration-300 ease-in-out transform hover:scale-110;
}
</style>
