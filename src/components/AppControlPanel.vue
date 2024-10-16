<script setup>
import helpButton from '/public/assets/icons/helpButton.png';
import soundButton from '/public/assets/icons/soundButton.png';

defineProps({
  openTutorialModal: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <div id="app-control-panel" class="z-50 absolute top-0 right-0">
    <div class="flex flex-col">
      <button @click="openTutorialModal">
        <img
          :src="helpButton"
          alt="Help Button"
          class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>

      <button @click="toggleSound()">
        <img
          :src="soundButton"
          alt="Sound Button"
          class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>
    </div>
  </div>
</template>
