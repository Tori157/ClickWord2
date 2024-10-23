<script>
import { ref } from 'vue';

import cancelicon from '../../public/assets/icons/cancel.png';
import selectLetterSound from '../../public/assets/sounds/select.mp3';
import successSound from '../../public/assets/sounds/success.mp3';
import failSound from '../../public/assets/sounds/fail.mp3';
import clickButtonSound from '../../public/assets/sounds/buttonclick.wav';
import clearSound from '../../public/assets/sounds/clear.wav';
import hintSound from '../../public/assets/sounds/hint.wav';
import backgroundMusic from '../../public/assets/sounds/puzzle-game-bg-music.mp3';

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

// Audio
// const showSoundSettingsModal = ref(false);
const effectVolumeEnabled = ref(true);
const backgroundMusicEnabled = ref(true);
const effectVolume = ref(0.5);
const backgroundMusicVolume = ref(0.5);
const selectAudio = new Audio(selectLetterSound);
const successAudio = new Audio(successSound);
const failAudio = new Audio(failSound);
const clearAudio = new Audio(clearSound);
const hintAudio = new Audio(hintSound);
const clickButtonAudio = new Audio(clickButtonSound);
const backgroundAudio = new Audio(backgroundMusic);

// const openSoundModal = () => {
//  showSoundSettingsModal.value = true;
// };

// const closeSoundModal = () => {
//  showSoundSettingsModal.value = false;
// };

const playSelectLetterSound = () => {
  selectAudio.currentTime = 0;
  selectAudio.play();
};

const playSuccessSound = () => {
  successAudio.play();
};

const playFailSound = () => {
  failAudio.play();
};

const playClickButtonSound = () => {
  clickButtonAudio.play();
};

const playClearSound = () => {
  clearAudio.play();
};

const playHintSound = () => {
  hintAudio.currentTime = 0;
  hintAudio.play();
};

const playBackgroundMusic = () => {
  backgroundAudio.play();
  backgroundAudio.loop = true;
};

const setEffectVolume = (newVolume) => {
  effectVolume.value = newVolume;
  if (effectVolumeEnabled.value) {
    setVolumeForEffects(newVolume);
  } else {
    setVolumeForEffects(0);
  }
};

const setBackgroundMusicVolume = (newVolume) => {
  backgroundMusicVolume.value = newVolume;

  if (backgroundMusicEnabled.value) {
    backgroundAudio.volume = newVolume;
    if (backgroundAudio.paused) {
      backgroundAudio.play();
    }
  } else {
    backgroundAudio.pause();
  }
};

const setVolumeForEffects = (newVolume) => {
  selectAudio.volume = newVolume;
  successAudio.volume = newVolume;
  clickButtonAudio.volume = newVolume;
  failAudio.volume = newVolume;
  clearAudio.volume = newVolume;
  hintAudio.volume = newVolume;
};
</script>
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-500 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="relative w-full max-w-3xl p-6 bg-[#FEF9EF] rounded-lg shadow-lg text-black">
      <h2 class="text-xl mb-4">Sound Settings</h2>

      <!-- Toggle for Sound Effects -->
      <div class="mb-4 flex items-center">
        <input v-model="effectVolumeEnabled" type="checkbox" class="mr-2" @change="setEffectVolume(effectVolume)" />
        <label>Enable Sound Effects</label>
      </div>

      <!-- Volume Control for Sound Effects -->
      <div v-if="effectVolumeEnabled" class="mb-4">
        <label for="effectVolume" class="block mb-2">Sound Effects Volume</label>
        <input
          v-model="effectVolume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="w-full"
          @input="setEffectVolume(effectVolume)"
        />
      </div>

      <!-- Toggle for Background Music -->
      <div class="mb-4 flex items-center">
        <input
          v-model="backgroundMusicEnabled"
          type="checkbox"
          class="mr-2"
          @change="setBackgroundMusicVolume(backgroundMusicVolume)"
        />
        <label>Enable Background Music</label>
      </div>

      <!-- Volume Control for Background Music -->
      <div v-if="backgroundMusicEnabled">
        <label for="backgroundMusicVolume" class="block mb-2">Background Music Volume</label>
        <input
          v-model="backgroundMusicVolume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="w-full"
          @input="setBackgroundMusicVolume(backgroundMusicVolume)"
        />
      </div>

      <button class="absolute top-1 right-1 hover:text-gray-800" @click="closeSoundModal(), playClickButtonSound()">
        <img
          :src="cancelicon"
          class="w-[40px] h-[40px] mr-4 mt-4 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>
    </div>
  </div>
</template>
