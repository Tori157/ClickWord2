<script setup>
import { reactive } from 'vue';
import { useSoundPlayerStore } from '@/stores';
import cancelicon from '/assets/icons/cancel.png';

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

const soundStore = useSoundPlayerStore();
const { volumes, isEnabled } = soundStore;

const enableSounds = reactive({
  bgMusic: isEnabled.bgMusic,
  sfx: isEnabled.sfx,
});
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[500] flex items-center justify-center bg-black bg-opacity-50"
    @click.self="onClose"
  >
    <div class="relative w-full max-w-3xl p-6 bg-[#FEF9EF] rounded-lg shadow-lg text-black">
      <h2 class="text-xl mb-4">Sound Settings</h2>

      <!-- Toggle for Sound Effects -->
      <div class="mb-4 flex items-center">
        <input
          v-model="enableSounds.sfx"
          type="checkbox"
          class="mr-2"
          :checked="enableSounds.sfx"
          @change="soundStore.toggleSFX"
        />
        <label>Enable Sound Effects</label>
      </div>

      <!-- Volume Control for Sound Effects -->
      <div class="mb-4">
        <label for="effectVolume" class="block mb-2">Sound Effects Volume</label>
        <input
          v-model="volumes.sfx"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="w-full"
          :disabled="!enableSounds.sfx"
          @input="(e) => soundStore.updateSFXVolume(e.target.value)"
        />
      </div>

      <!-- Toggle for Background Music -->
      <div class="mb-4 flex items-center">
        <input
          v-model="enableSounds.bgMusic"
          type="checkbox"
          class="mr-2"
          :checked="enableSounds.bgMusic"
          @change="soundStore.toggleBgMusic"
        />
        <label>Enable Background Music</label>
      </div>

      <!-- Volume Control for Background Music -->
      <div>
        <label for="backgroundMusicVolume" class="block mb-2">Background Music Volume</label>
        <input
          v-model="volumes.bgMusic"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="w-full"
          :disabled="!enableSounds.bgMusic"
          @input="(e) => soundStore.updateBgMusicVolume(e.target.value)"
        />
      </div>

      <button class="absolute top-1 right-1 hover:text-gray-800" @click="onClose(), soundStore.playSound('baseClick')">
        <img
          :src="cancelicon"
          alt="Close"
          class="w-[40px] h-[40px] mr-4 mt-4 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>
    </div>
  </div>
</template>
