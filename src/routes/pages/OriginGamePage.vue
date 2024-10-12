<script setup>
import { ref, computed, watch, reactive } from 'vue';
import playButton from '../../../public/assets/icons/play.png';
import bulb from '../../../public/assets/icons/bulb.png';
import prize from '../../../public/assets/icons/prize.png';
import back from '../../../public/assets/icons/back.png';
import homeButton from '../../../public/assets/icons/HomeButton.png';
import helpButton from '../../../public/assets/icons/helpButton.png';
// import soundButton from '../../../public/assets/icons/soundButton.png';
import settingButton from '../../../public/assets/icons/settingButton.png';
import loadSuccess from '../../../public/assets/icons/loadPhoto.png';
import levelSuccess from '../../../public/assets/icons/level-up-photo.png';
import continueButton from '../../../public/assets/icons/continue.png';
import prizePhoto from '../../../public/assets/icons/prizePhoto.png';
import Questions from '../../data/word_levels.json';
import helppage1 from '../../../public/assets/images/helppage1.webp';
import helppage2 from '../../../public/assets/images/helppage2.webp';
import helppage3 from '../../../public/assets/images/helppage3.webp';
import helppage4 from '../../../public/assets/images/helppage4.webp';
import helppage5 from '../../../public/assets/images/helppage5.webp';
import helppage6 from '../../../public/assets/images/helppage6.webp';
import helppage7 from '../../../public/assets/images/helppage7.webp';
import nextlefticon from '../../../public/assets/icons/nextlefticon.png';
import nextrighticon from '../../../public/assets/icons/nextrighticon.png';
import cancelicon from '../../../public/assets/icons/cancel.png';
import selectLetterSound from '../../../public/assets/sounds/select.mp3';
import successSound from '../../../public/assets/sounds/success.mp3';
import failSound from '../../../public/assets/sounds/fail.mp3';
import clickButtonSound from '../../../public/assets/sounds/buttonclick.wav';
import clearSound from '../../../public/assets/sounds/clear.wav';
import hintSound from '../../../public/assets/sounds/hint.wav';
import backgroundMusic from '../../../public/assets/sounds/puzzle-game-bg-music.mp3';
import QueueManager from '@/class/QueueManager';

import '@/extensions/array';

// For Routing
const PAGE_NAME = {
  HOME: 'home',
  MODE: 'mode',
  GAME_PLAY: 'game-play',
  LEVEL_COMPLETE: 'level-complete',
  MODE_COMPLETE: 'mode-complete',
  FINAL: 'final',
  TUTORIAL: 'tutorial',
};
const currentPage = ref(PAGE_NAME.HOME);
const isOnPage = (pageName) => currentPage.value === pageName;
const navigateTo = (pageName) => {
  currentPage.value = pageName;
};

const filteredWordCollection = ref([]);
const level = reactive(JSON.parse(localStorage.getItem('level')) ?? { easy: 1, medium: 1, hard: 1 });
const selectedWord = ref([]);
const selectedAnswer = computed(() => {
  const mapped = selectedWord.value.map((ans) => ({
    ...ans,
    letter: ans.reserved ? ans.letter : '',
  }));

  const fixedElements = mapped.filter((ans) => ans.useHint);
  const sortableElements = mapped.filter((ans) => !ans.useHint);

  const sortedElements = sortableElements.toSorted((a, b) => {
    const orderA = a.order === undefined ? Infinity : a.order;
    const orderB = b.order === undefined ? Infinity : b.order;
    return orderA - orderB;
  });

  const result = Array(mapped.length).fill(null);
  fixedElements.forEach((el) => {
    result[el.pos] = el;
  });

  sortedElements.forEach((el) => {
    const emptyIndex = result.findIndex((item) => item === null);
    result[emptyIndex] = el;
  });

  return result;
});
const correctAnswer = ref([]);
const boxAnswerLength = ref(0);

const hints = ref(localStorage.getItem('hints') || 1000);
const answerHistory = JSON.parse(localStorage.getItem('answerHistory')) || {};
const onMode = ref('');

// Audio
const showSoundSettingsModal = ref(false);
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
const selectedAnswerStatus = ref('');

const success = ref(Number(localStorage.getItem('userSuccess')) ?? 0);
const maxLevels = {
  easy: 3,
  medium: 3,
  hard: 3,
};

const queueManager = new QueueManager('wordQueue', Questions, maxLevels);

const saveToLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const completedGame = () => {
  const firstRoundCompleted = JSON.parse(localStorage.getItem('firstRoundCompleted'));
  if (firstRoundCompleted) {
    return Object.values(firstRoundCompleted).every((key) => key);
  }
};

const nextLevel = () => {
  if (level[onMode.value] > maxLevels[onMode.value]) {
    navigateTo(PAGE_NAME.MODE_COMPLETE);
    hints.value += 5;
    level[onMode.value] = 1;
    saveToLocalStorage('level', level);

    return;
  }

  navigateTo(PAGE_NAME.GAME_PLAY);

  const question = filteredWordCollection.value.find((word) => word.id === queueManager.getNext(onMode.value)?.id);

  const answerHistory = JSON.parse(localStorage.getItem('answerHistory'));
  const currentWordId = queueManager.getNext(onMode.value)?.id;

  if (answerHistory && Object.keys(answerHistory).map(Number).includes(currentWordId)) {
    selectedWord.value = answerHistory[currentWordId];
  } else {
    selectedWord.value = question.word
      .split('')
      .map((letter, index) => ({ letter, pos: index }))
      .shuffle();
  }

  boxAnswerLength.value = selectedWord.value.length;
  correctAnswer.value = question.correctAnswer.split('');
};

const playOnMode = (mode) => {
  onMode.value = mode;
  filteredWordCollection.value = Questions.filterBy('difficulty', mode).shuffle();
  nextLevel();
};

const findIndexOfFirstEmpty = (arr, key) => arr.findIndex((e) => !e[key]);

const saveAnswerHistory = () => {
  answerHistory[queueManager.getNext(onMode.value).id] = selectedWord.value.map((ans) => {
    if (ans.useHint) {
      return ans;
    } else {
      return { ...ans, reserved: false };
    }
  });

  saveToLocalStorage('answerHistory', answerHistory);
};

const selectLetter = (index) => {
  if (filledBoxLength.value < selectedAnswer.value.length) {
    const indexOfFirstEmpty = findIndexOfFirstEmpty(selectedAnswer.value, 'letter');

    Object.assign(selectedWord.value[index], {
      reserved: true,
      order: indexOfFirstEmpty,
    });

    playSelectLetterSound();
  }
};

const checkAnswer = () => {
  const isCorrect = correctAnswer.value.every((char, index) => char === selectedAnswer.value[index].letter);
  if (isCorrect) {
    selectedAnswerStatus.value = 'correct';
    const isLevelWithinMax = level[onMode.value] <= maxLevels[onMode.value];
    playSuccessSound();
    setTimeout(() => {
      successAudio.pause();
      successAudio.currentTime = 0;
      navigateTo(PAGE_NAME.LEVEL_COMPLETE);
      if (isLevelWithinMax) {
        level[onMode.value] += 1;
        saveToLocalStorage('level', level);
      }
    }, 1900);
    setTimeout(() => {
      localStorage.removeItem('answerHistory');
      if (!queueManager.isFirstRoundCompleted(onMode.value) && isLevelWithinMax) {
        success.value += 1;
      }
      saveToLocalStorage('userSuccess', success.value);
      const isSuccessPendingCompletion = Math.round(success.value) === 100 && !completedGame();
      if (isSuccessPendingCompletion) {
        navigateTo(PAGE_NAME.FINAL);
        hints.value += 5;
        setTimeout(() => {
          navigateTo(PAGE_NAME.HOME);
        }, 1900);
      }
      queueManager.dequeue(onMode.value);
      if (!isSuccessPendingCompletion) nextLevel();
      selectedAnswerStatus.value = '';
    }, 3000);
  } else {
    selectedAnswerStatus.value = 'incorrect';
    playFailSound();
    setTimeout(() => {
      clearSelectAnswer();
      selectedAnswerStatus.value = '';
      localStorage.removeItem('answerHistory');
    }, 1900);
  }
};

const clearSelectAnswer = () => {
  selectedWord.value.forEach((ans) => {
    if (!ans.useHint) {
      delete ans.reserved;
      delete ans.order;
    }
  });
  saveAnswerHistory();
};

const splitWords = computed(() => {
  const rows = [];
  const perRow = Math.ceil(boxAnswerLength.value / 2);
  selectedWord.value.forEach((ans, index) => {
    const rowIndex = Math.floor(index / perRow);
    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }
    rows[rowIndex].push({ ...ans, index });
  });
  return rows;
});

const filledBoxLength = computed(() => selectedAnswer.value.filter((ans) => ans.reserved).length);

const applyHint = () => {
  if (hints.value > 0 && filledBoxLength.value < selectedAnswer.value.length) {
    const availableIndexes = selectedWord.value.map((ans, i) => (!ans.useHint ? i : -1)).filter((i) => i !== -1);
    const randomOfAvailable = Math.floor(Math.random() * availableIndexes.length);
    const randomIndex = availableIndexes[randomOfAvailable];

    Object.assign(selectedWord.value[randomIndex], {
      reserved: true,
      useHint: true,
    });

    saveAnswerHistory();

    hints.value -= 1;
  }
};

const showHelpModal = ref(false);
const currentTutorialPage = ref(0);
const helpPages = [helppage1, helppage2, helppage3, helppage4, helppage5, helppage6, helppage7];

const openHelpModal = () => {
  currentTutorialPage.value = 0;
  showHelpModal.value = true;
};

const closeHelpModal = () => {
  showHelpModal.value = false;
};

const openSoundModal = () => {
  showSoundSettingsModal.value = true;
};

const closeSoundModal = () => {
  showSoundSettingsModal.value = false;
};

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

watch(
  () => filledBoxLength.value,
  () => {
    if (filledBoxLength.value >= selectedAnswer.value.length) {
      checkAnswer();
    }
  },
);

watch(
  () => hints.value,
  () => {
    saveToLocalStorage('hints', hints.value);
  },
);

const titleGame1 = ['c', 'l', 'i', 'c', 'k'];
const titleGame2 = ['w', 'o', 'r', 'd'];
const modeGameTitle = ['m', 'o', 'd', 'e'];
</script>

<template>
  <div class="relative">
    <!-- Start Page -->
    <div v-if="isOnPage(PAGE_NAME.HOME)" class="bg-[#FEF9EF] flex flex-col items-center justify-center h-screen">
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

      <div class="z-50 absolute top-0 right-0">
        <div class="flex flex-col">
          <button @click="openHelpModal">
            <img
              :src="helpButton"
              alt="Help Button"
              class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
            />
          </button>

          <button @click="openSoundModal()">
            <img
              :src="settingButton"
              alt="Sound Button"
              class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
            />
          </button>
        </div>
      </div>

      <button
        @click="
          navigateTo(PAGE_NAME.MODE), playClickButtonSound();
          playBackgroundMusic();
        "
      >
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

    <!-- Mode Page -->
    <div v-if="isOnPage(PAGE_NAME.MODE)" class="bg-[#FEF9EF] flex flex-col items-center justify-center h-screen gap-16">
      <div class="waviy titles text-[150px] text-[#237C9D]">
        <span v-for="(char, index) in modeGameTitle" :key="index" class="mr-6" :style="`--i: ${index + 1}`">
          {{ char }}
        </span>
      </div>
      <div class="z-50 absolute top-0 right-0">
        <div class="flex flex-col">
          <button @click="openHelpModal(), playClickButtonSound()">
            <img
              :src="helpButton"
              alt="Help Button"
              class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
            />
          </button>

          <button @click="openSoundModal(), playClickButtonSound()">
            <img
              :src="settingButton"
              alt="Sound Button"
              class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
            />
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <button
          class="bg-[#19C3B2] text-[#FEF9EF] text-[40px] rounded-2xl px-8 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#20a396]"
          @click="playOnMode('easy'), playClickButtonSound()"
        >
          Easy
        </button>
        <button
          class="bg-[#FFCB77] text-[#FEF9EF] text-[40px] rounded-2xl px-8 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#ffb031]"
          @click="playOnMode('medium'), playClickButtonSound()"
        >
          Medium
        </button>
        <button
          class="bg-[#FE6D73] text-[#FEF9EF] text-[40px] rounded-2xl px-8 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#ee464c]"
          @click="playOnMode('hard'), playClickButtonSound()"
        >
          Hard
        </button>
        <button
          @click="
            navigateTo(PAGE_NAME.HOME);
            playClickButtonSound();
          "
        >
          <img
            :src="back"
            alt="Back Button"
            class="w-20 h-20 mx-auto my-auto mb-1 mt-16 transition duration-300 ease-in-out transform hover:scale-150"
          />
        </button>
      </div>
    </div>

    <!-- Play Page -->
    <div v-if="isOnPage(PAGE_NAME.GAME_PLAY)" class="flex flex-col justify-between bg-[#FEF9EF] h-screen">
      <div class="flex justify-between items-start">
        <button
          @click="
            navigateTo(PAGE_NAME.MODE);
            playClickButtonSound();
          "
        >
          <img
            :src="homeButton"
            alt="Home Button"
            class="w-[50px] h-[50px] ml-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
          />
        </button>
        <h3 class="mt-6 text-4xl text-black">{{ `Level ${level[onMode]}` }}</h3>

        <div class="flex flex-col">
          <button @click="openHelpModal(), playClickButtonSound()">
            <img
              :src="helpButton"
              alt="Help Button"
              class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
            />
          </button>

          <button @click="openSoundModal(), playClickButtonSound()">
            <img
              :src="settingButton"
              alt="Sound Button"
              class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
            />
          </button>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center">
        <div v-for="(row, rowIndex) in splitWords" :key="rowIndex" class="flex flex-row gap-2 mb-8">
          <button
            v-for="item in row"
            :key="item.index"
            :disabled="item.reserved"
            :class="[
              'text-[40px]',
              'text-[#FEF9EF]',
              'rounded-2xl',
              'w-20',
              'h-20',
              'hover:bg-[#09897c]',
              item.reserved ? 'bg-[#09897c]' : 'bg-[#19C3B2]',
            ]"
            @click="selectLetter(item.index)"
          >
            {{ item.letter.toUpperCase() }}
          </button>
        </div>
        <div class="flex flex-row gap-2 mt-10">
          <div
            v-for="(item, index) in selectedAnswer"
            :key="index"
            :class="[
              item.useHint ? 'hinted-box' : !item.letter ? 'unfilled-box' : 'filled-box',
              selectedAnswerStatus === 'correct'
                ? 'correct-box'
                : selectedAnswerStatus === 'incorrect'
                  ? 'incorrect-box'
                  : '',
            ]"
            class="box-base"
          >
            {{ item.letter.toUpperCase() }}
          </div>
        </div>
      </div>

      <div class="flex justify-center items-end mb-16 gap-10">
        <button
          class="bg-[#000000] text-[#FEF9EF] text-3xl rounded-xl px-20 w-58 hover:bg-[#878787] focus:bg-black transition duration-300 ease-in-out transform hover:scale-110"
          @click="clearSelectAnswer(), playClearSound()"
        >
          Clear
        </button>
        <button
          :disabled="hints === 0"
          :class="[
            'bg-[#000000] text-[#FEF9EF] text-3xl rounded-xl px-12 w-58 transition duration-300 ease-in-out transform hover:scale-110',
            hints > 0 ? 'hover:bg-[#878787] focus:bg-black' : 'opacity-50 cursor-not-allowed',
          ]"
          @click="applyHint(), playHintSound()"
        >
          Hints ({{ hints }})
        </button>
      </div>
    </div>

    <!-- Success Page -->
    <div
      v-if="isOnPage(PAGE_NAME.LEVEL_COMPLETE)"
      class="bg-[#227C9D] h-screen flex flex-col justify-center items-center"
    >
      <h2 class="text-white text-7xl mt-10 justify-start">
        {{ `Level ${level[onMode] - 1} completed !` }}
      </h2>
      <img :src="loadSuccess" alt="Prize" class="w-[610px] h-[600px] items-end" />
    </div>

    <!-- Level-up Page -->
    <div
      v-if="isOnPage(PAGE_NAME.MODE_COMPLETE)"
      class="bg-[#227C9D] h-screen flex flex-col justify-center items-center space-y-8"
    >
      <h2 class="text-white text-7xl mt-10">
        {{ `Finished Mode ${onMode.charAt(0).toUpperCase() + onMode.slice(1)}` }}
      </h2>
      <img :src="levelSuccess" alt="Prize" class="w-[410px] h-[400px] items-end mt-[-10px]" />
      <button
        class="hover:scale-150"
        @click="
          navigateTo(PAGE_NAME.MODE);
          playClickButtonSound();
        "
      >
        <img :src="continueButton" alt="Continue" class="w-[150px] h-[150px] items-end mt-[-100px] hover:scale-110" />
      </button>
      <h2 class="text-white text-4xl mb-[60px] justify-end">You have received 5 additional hint.</h2>
    </div>

    <!-- Final Page -->
    <div v-if="isOnPage(PAGE_NAME.FINAL)" class="bg-[#227C9D] h-screen flex flex-col justify-between items-center">
      <h2 class="text-white text-7xl mt-10">Congratulations !</h2>
      <h2 class="text-white text-2xl mt-10">You success 100% in this game</h2>

      <img :src="prizePhoto" alt="Prize" class="w-[1500px] h-[800px] items-end mt-[-100px]" />
    </div>

    <!-- Help Modal -->
    <div v-if="showHelpModal" class="fixed inset-0 z-500 flex items-center justify-center bg-black bg-opacity-50">
      <div class="relative w-full max-w-3xl p-6 bg-[#FEF9EF] rounded-lg shadow-lg">
        <button
          class="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          @click="closeHelpModal(), playClickButtonSound()"
        >
          <img
            :src="cancelicon"
            class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
          />
        </button>
        <div class="flex items-center justify-between">
          <button
            :disabled="currentTutorialPage === 0"
            :class="currentTutorialPage > 0 ? '' : 'invisible'"
            class="p-2 transition duration-300 ease-in-out transform hover:scale-110"
            @click="prevPage(), playClickButtonSound()"
          >
            <img :src="nextlefticon" alt="Previous" class="w-10 h-10" />
          </button>
          <div class="flex justify-center items-center w-[500px] h-auto">
            <img :src="helpPages[currentTutorialPage]" alt="Help Page" class="w-full h-auto" />
          </div>
          <button
            :disabled="currentTutorialPage === helpPages.length - 1"
            :class="currentTutorialPage < helpPages.length - 1 ? '' : 'invisible'"
            class="p-2 transition duration-300 ease-in-out transform hover:scale-110"
            @click="nextPage(), playClickButtonSound()"
          >
            <img :src="nextrighticon" alt="Next" class="w-10 h-10" />
          </button>
        </div>
      </div>
    </div>

    <!-- Sound Settings Modal -->
    <div
      v-if="showSoundSettingsModal"
      class="fixed inset-0 z-500 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="relative w-full max-w-3xl p-6 bg-[#FEF9EF] rounded-lg shadow-lg text-black">
        <h2 class="text-xl mb-4">Sound Settings</h2>

        <!-- Toggle for Sound Effects -->
        <div class="mb-4 flex items-center">
          <input type="checkbox" v-model="effectVolumeEnabled" @change="setEffectVolume(effectVolume)" class="mr-2" />
          <label>Enable Sound Effects</label>
        </div>

        <!-- Volume Control for Sound Effects -->
        <div v-if="effectVolumeEnabled" class="mb-4">
          <label for="effectVolume" class="block mb-2">Sound Effects Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model="effectVolume"
            @input="setEffectVolume(effectVolume)"
            class="w-full"
          />
        </div>

        <!-- Toggle for Background Music -->
        <div class="mb-4 flex items-center">
          <input
            type="checkbox"
            v-model="backgroundMusicEnabled"
            @change="setBackgroundMusicVolume(backgroundMusicVolume)"
            class="mr-2"
          />
          <label>Enable Background Music</label>
        </div>

        <!-- Volume Control for Background Music -->
        <div v-if="backgroundMusicEnabled">
          <label for="backgroundMusicVolume" class="block mb-2">Background Music Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model="backgroundMusicVolume"
            @input="setBackgroundMusicVolume(backgroundMusicVolume)"
            class="w-full"
          />
        </div>

        <button @click="closeSoundModal(), playClickButtonSound()" class="absolute top-1 right-1 hover:text-gray-800">
          <img
            :src="cancelicon"
            class="w-[40px] h-[40px] mr-4 mt-4 transition duration-300 ease-in-out transform hover:scale-110"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Itim&display=swap');

* {
  user-select: none;
  font-family: 'Itim', cursive;
  font-weight: 400;
  font-style: normal;
}

.titles {
  font-family: 'Irish Grover', sans-serif;
  font-weight: 500;
  font-style: normal;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  /* เงาที่ตัวอักษร */
  margin-right: 5px; /* เพิ่มช่องว่างระหว่างตัวอักษร */
  letter-spacing: 5px; /* เพิ่มช่องว่างระหว่างตัวอักษร */
}

@keyframes bounce {
  0%,
  100% {
    /* ตำแหน่งเริ่มต้นและสิ้นสุด */
    transform: translateY(0);
  }
  10%,
  50% {
    /* ขยับขึ้น 2 ครั้ง */
    transform: translateY(-5px);
  }
  30%,
  70% {
    /* กลับมาที่ตำแหน่งเดิม 2 ครั้ง */
    transform: translateY(0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  50% {
    transform: translateX(-5px); /* สั่นไปทางซ้าย */
  }
  30%,
  70% {
    transform: translateX(5px); /* สั่นไปทางขวา */
  }
}

.correct-box {
  animation: bounce 1.5s infinite; /* ขยับขึ้นลง */
}

.incorrect-box {
  animation: shake 1.5s; /* สั่น */
}

.waviy {
  position: relative;
}
.waviy span {
  position: relative;
  display: inline-block;
  text-transform: uppercase;
  animation: flip 4s infinite;
  animation-delay: calc(0.2s * var(--i));
  font-family: 'Irish Grover', sans-serif;
}
@keyframes flip {
  0%,
  50% {
    transform: rotateY(360deg);
  }
}
</style>
