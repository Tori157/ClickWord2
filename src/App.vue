<script setup>
import { ref, computed, watch, reactive } from 'vue';
import playButton from './assets/icons/play.png';
import bulb from './assets/icons/bulb.png';
import prize from './assets/icons/prize.png';
import back from './assets/icons/back.png';
import homeButton from './assets/icons/HomeButton.png';
import helpButton from './assets/icons/helpButton.png';
import soundButton from './assets/icons/soundButton.png';
import loadSuccess from './assets/icons/loadPhoto.png';
import levelSuccess from './assets/icons/level-up-photo.png';
import continueButton from './assets/icons/continue.png';
import prizePhoto from './assets/icons/prizePhoto.png';
import Questions from './data/word_levels.json';
import helppage1 from './assets/images/helppage1.webp';
import helppage2 from './assets/images/helppage2.webp';
import helppage3 from './assets/images/helppage3.webp';
import helppage4 from './assets/images/helppage4.webp';
import nextlefticon from './assets/icons/nextlefticon.png';
import nextrighticon from './assets/icons/nextrighticon.png';
import cancelicon from './assets/icons/cancel.png';
import volumeUp from './assets/icons/volumeUp.png';
import volumeDown from './assets/icons/volumeDown.png';
import selectLetterSound from './assets/sounds/select.mp3';
import successSound from './assets/sounds/success.mp3';
import failSound from './assets/sounds/fail.mp3';
import clickButtonSound from './assets/sounds/buttonclick.wav';
import clearSound from './assets/sounds/clear.wav';
import hintSound from './assets/sounds/hint.wav';
import backgroundMusic from './assets/sounds/puzzle-game-bg-music.mp3';
import QueueManager from './class/QueueManager';

import './extensions/array';

const isVisible = ref(0);
const filteredWordCollection = ref([]);
const playedIds = [];
const currentWordId = ref(0);
const level = reactive(
  JSON.parse(localStorage.getItem('level')) ?? { easy: 1, medium: 1, hard: 1 }
);
const selectedWord = ref([]);
const selectedAnswer = ref([]);
const correctAnswer = ref([]);
const boxAnswerLength = ref(0);
const hints = ref(localStorage.getItem('hints') || 3);
const usedHintIndexes = ref([]);
const clickedLetters = ref({});
const onMode = ref('');
const isVolumeVisible = ref(false);
const volume = ref(0.5);
const selectAudio = new Audio(selectLetterSound);
const successAudio = new Audio(successSound);
const failAudio = new Audio(failSound);
const clearAudio = new Audio(clearSound);
const hintAudio = new Audio(hintSound);
const clickButtonAudio = new Audio(clickButtonSound);
const backgroundAudio = new Audio(backgroundMusic);
const volumeTimeout = ref(null);
const selectedAnswerStatus = ref('');

const success = ref(Number(localStorage.getItem('userSuccess')) ?? 0);
const maxLevels = {
  easy: 35,
  medium: 35,
  hard: 30
};

const queueManager = new QueueManager('wordQueue', Questions, maxLevels);

const startPage = () => {
  isVisible.value = 0;
};

const modePage = () => {
  isVisible.value = 1;
};

const gamePlayPage = () => {
  isVisible.value = 2;
};

const successPage = () => {
  isVisible.value = 3;
};

const successMode = () => {
  isVisible.value = 4;
  hints.value += 5;
};

const saveToLocalStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

const nextLevel = () => {
  usedHintIndexes.value.length = 0;
  if (level[onMode.value] > maxLevels[onMode.value]) {
    successMode();
    level[onMode.value] = 1;
    saveToLocalStorage('level', level);
    return;
  }

  gamePlayPage();
  clearSelectAnswer();

  filteredWordCollection.value =
    filteredWordCollection.value.filterByExcludeIds(playedIds);

  const question = filteredWordCollection.value.find(
    (word) => word.id === queueManager.getNext(onMode.value)?.id
  );

  currentWordId.value = question.id;

  selectedWord.value = question.word.split('').shuffle();
  boxAnswerLength.value = selectedWord.value.length;
  correctAnswer.value = question.correctAnswer.split('');
  selectedAnswer.value = Array(boxAnswerLength.value).fill('');
};

const playOnMode = (mode) => {
  onMode.value = mode;
  playedIds.length = 0;
  filteredWordCollection.value = Questions.filterBy(
    'difficulty',
    mode
  ).shuffle();
  nextLevel();
  restoreHints();
};

const restoreHints = () => {
  saveHintsArray.length = 0;
  usedHintIndexes.value.length = 0;

  const levelName = onMode.value;
  const key = `testSave_${levelName}`;
  const savedHints = localStorage.getItem(key);

  if (savedHints) {
    const savedHintsObject = JSON.parse(savedHints);
    const hintsArray = savedHintsObject[currentWordId.value] || [];

    hintsArray.forEach((hint) => {
      putHintOn(hint.letter, hint.index);
    });

    saveHintsArray.push(...hintsArray);
  }
};

const selectLetter = (letter, index) => {
  if (
    filledBoxLength.value < selectedAnswer.value.length &&
    !clickedLetters.value[index]
  ) {
    playSelectLetterSound();
    const firstEmptyIndex = selectedAnswer.value.findIndex(
      (char) => char === ''
    );
    if (firstEmptyIndex !== -1) {
      selectedAnswer.value[firstEmptyIndex] = letter;
      clickedLetters.value[index] = true;
    }
  }
};

const putHintOn = (letter, correctIndex) => {
  if (filledBoxLength.value < selectedAnswer.value.length) {
    selectedAnswer.value[correctIndex] = letter;
    usedHintIndexes.value.push(correctIndex);
    const clickedIndex = splitWords.value
      .flat()
      .findIndex((e, i) => letter === e.letter && !clickedLetters.value[i]);
    if (clickedIndex !== -1) {
      clickedLetters.value[clickedIndex] = true;
    }
  }
};

const checkAnswer = () => {
  const flattenedSelectedAnswer = selectedAnswer.value.flat();
  const isCorrect = correctAnswer.value.every(
    (char, index) => char === flattenedSelectedAnswer[index]
  );

  if (isCorrect) {
    selectedAnswerStatus.value = 'correct';
    playSuccessSound();
    // เพื่อหยุดเสียงหลังจากเล่นแล้ว
    setTimeout(() => {
      successAudio.pause();
      successAudio.currentTime = 0;
      successPage();
    }, 1900);
    setTimeout(() => {
      playedIds.push(currentWordId.value);
      nextLevel();
      selectedAnswer.value = Array(boxAnswerLength.value).fill('');
      selectedAnswerStatus.value = '';
    }, 3000);

    if (level[onMode.value] <= maxLevels[onMode.value]) {
      level[onMode.value] += 1;
      success.value += queueManager.isFirstRoundCompleted(onMode.value) ? 0 : 1;
    }

    queueManager.dequeue(onMode.value);
    saveToLocalStorage('level', level);
    saveToLocalStorage('userSuccess', success.value);
  } else {
    selectedAnswerStatus.value = 'incorrect';
    playFailSound();
    setTimeout(() => {
      clearSelectAnswer();
      selectedAnswerStatus.value = '';
    }, 1900);
  }
};

const clearSelectAnswer = () => {
  // เก็บค่า hints ที่ใช้แล้วก่อน
  const usedHints = usedHintIndexes.value.map(
    (index) => selectedAnswer.value[index]
  );

  selectedAnswer.value = Array(boxAnswerLength.value).fill('');
  clickedLetters.value = {};

  // นำค่า hints ที่ใช้กลับไปวางในตำแหน่งเดิม
  usedHintIndexes.value.forEach((index, i) => {
    selectedAnswer.value[index] = usedHints[i];
  });
};

const splitWords = computed(() => {
  const rows = [];
  const perRow = Math.ceil(boxAnswerLength.value / 2);
  selectedWord.value.forEach((letter, index) => {
    const rowIndex = Math.floor(index / perRow);
    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }
    rows[rowIndex].push({ letter, index });
  });
  return rows;
});

const filledBoxLength = computed(
  () => selectedAnswer.value.filter((l) => /^[a-zA-Z]+$/.test(l)).length
);

// Save already used hints
const saveHints = {};
const saveHintsArray = [];
const saveHintsForLevel = (levelName) => {
  const key = `testSave_${levelName}`;
  // บันทึก saveHints ลงใน localStorage
  localStorage.setItem(key, JSON.stringify(saveHints));
};

const useHint = () => {
  if (hints.value > 0 && filledBoxLength.value < correctAnswer.value.length) {
    const availableIndexes = Array.from(
      { length: correctAnswer.value.length },
      (_, i) => i
    ).filter((e) => !usedHintIndexes.value.includes(e));

    const randomOfAvailable = Math.floor(
      Math.random() * availableIndexes.length
    );
    const randomIndex = availableIndexes[randomOfAvailable];

    const hint = {
      index: randomIndex,
      letter: correctAnswer.value[randomIndex]
    };

    if (!saveHints[currentWordId.value]) {
      saveHints[currentWordId.value] = [];
    }

    saveHints[currentWordId.value].push(hint);

    const levelName = onMode.value;
    saveHintsForLevel(levelName);

    putHintOn(correctAnswer.value[randomIndex], randomIndex);
    hints.value -= 1;
  }
};

watch(
  () => filledBoxLength.value,
  () => {
    if (filledBoxLength.value >= correctAnswer.value.length) {
      checkAnswer();
    }
  }
);

watch(
  () => hints.value,
  (newHints, _) => {
    localStorage.setItem('hints', newHints);
  }
);

const showHelpModal = ref(false);
const currentPage = ref(0);
const helpPages = [helppage1, helppage2, helppage3, helppage4];

const openHelpModal = () => {
  currentPage.value = 0;
  showHelpModal.value = true;
};

const closeHelpModal = () => {
  showHelpModal.value = false;
};

const nextPage = () => {
  if (currentPage.value < helpPages.length - 1) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const toggleSound = () => {
  isVolumeVisible.value = !isVolumeVisible.value;
  if (isVolumeVisible.value) {
    clearTimeout(volumeTimeout.value);
    volumeTimeout.value = setTimeout(() => {
      isVolumeVisible.value = false;
    }, 3000);
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

const setVolume = (newVolume) => {
  selectAudio.volume = newVolume;
  successAudio.volume = newVolume;
  clickButtonAudio.volume = newVolume;
  failAudio.volume = newVolume;
  clearAudio.volume = newVolume;
  hintAudio.volume = newVolume;
  backgroundAudio.volume = newVolume;
};

watch(volume, (newVolume) => {
  setVolume(newVolume);

  if (isVolumeVisible.value) {
    // รีเซ็ต timeout เมื่อมีการเปลี่ยนแปลงระดับเสียง
    clearTimeout(volumeTimeout.value);
    volumeTimeout.value = setTimeout(() => {
      isVolumeVisible.value = false;
    }, 1000);
  }
});

const titlegames = ['c', 'l', 'i', 'c', 'k', ' ', ' ', 'w', 'o', 'r', 'd'];
</script>

<template>
  <div>
    <!-- Start Page -->
    <div
      v-if="isVisible === 0"
      class="bg-[#FEF9EF] flex flex-col items-center justify-center h-screen"
    >
      <div class="waviy titles text-[150px] text-[#237C9D]">
        <span
          v-for="(char, index) in titlegames"
          class="mr-6"
          :key="index"
          :style="`--i: ${index + 1}`"
        >
          {{ char }}
        </span>
      </div>
      <!-- <h1 class="titles flex text-[150px] text-[#237C9D] overflow-hidden">
        <span
          v-for="(titlegame, index) in titlegames"
          :key="index"
          class="titlegame titles"
          :style="{ animationDelay: `${index * 0.1}s` }"
          :class="{ 'space-x': letter === ' ' }"
        >
          {{ titlegame }}
        </span>
      </h1> -->
      <button
        @click="
          modePage();
          playClickButtonSound();
          playBackgroundMusic();
        "
      >
        <img
          :src="playButton"
          alt="Play Button"
          class="w-60 h-60 mx-auto mb-[50px] mt-10 transition duration-300 ease-in-out transform hover:scale-110"
        />
      </button>
      <div class="flex gap-80 mt-10">
        <div class="flex flex-col item-center gap-2">
          <img
            :src="prize"
            alt="Prize"
            class="w-20 h-20 mx-auto my-auto mb-1"
          />
          <h3 class="bg-[#19C3B2] text-[#FEF9EF] text-[20px] rounded-2xl p-3">
            Success ({{ success }}%)
          </h3>
        </div>
        <div class="flex flex-col item-center gap-2">
          <img
            :src="bulb"
            alt="Bulb Button"
            class="w-20 h-20 mx-auto my-auto mb-1 mr-3"
          />
          <h3 class="bg-[#FF9090] text-[#FEF9EF] text-[20px] rounded-2xl p-3">
            Hints ({{ hints }})
          </h3>
        </div>
      </div>
    </div>

    <!-- Mode Page -->
    <div
      v-if="isVisible === 1"
      class="bg-[#FEF9EF] flex flex-col items-center justify-center h-screen gap-16"
    >
      <h1 class="titles text-[130px] justify-start text-[#237C9D]">MODE</h1>
      <div class="flex flex-col gap-6">
        <button
          @click="
            playOnMode('easy');
            playClickButtonSound();
          "
          class="bg-[#19C3B2] text-[#FEF9EF] text-[40px] rounded-2xl px-8 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#20a396]"
        >
          Easy
        </button>
        <button
          @click="
            playOnMode('medium');
            playClickButtonSound();
          "
          class="bg-[#FFCB77] text-[#FEF9EF] text-[40px] rounded-2xl px-8 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#ffb031]"
        >
          Medium
        </button>
        <button
          @click="
            playOnMode('hard');
            playClickButtonSound();
          "
          class="bg-[#FE6D73] text-[#FEF9EF] text-[40px] rounded-2xl px-8 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-[#ee464c]"
        >
          Hard
        </button>
        <button
          @click="
            startPage();
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
    <div
      v-if="isVisible === 2"
      class="flex flex-col justify-between bg-[#FEF9EF] h-screen"
    >
      <div class="flex justify-between items-start">
        <button @click="modePage">
          <img
            :src="homeButton"
            alt="Home Button"
            class="w-[50px] h-[50px] ml-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
          />
        </button>
        <h3 class="mt-6 text-4xl text-black">{{ `Level ${level[onMode]}` }}</h3>
        <div class="flex flex-col">
          <button @click="openHelpModal">
            <img
              :src="helpButton"
              alt="Help Button"
              class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
            />
          </button>

          <!-- Help Modal -->
          <div
            v-if="showHelpModal"
            class="fixed inset-0 z-500 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div
              class="relative w-full max-w-3xl p-6 bg-[#FEF9EF] rounded-lg shadow-lg"
            >
              <button
                @click="closeHelpModal"
                class="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              >
                <img
                  :src="cancelicon"
                  class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
                />
              </button>
              <div class="flex items-center justify-between">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 0"
                  :class="currentPage > 0 ? '' : 'invisible'"
                  class="p-2 transition duration-300 ease-in-out transform hover:scale-110"
                >
                  <img :src="nextlefticon" alt="Previous" class="w-10 h-10" />
                </button>
                <div class="flex justify-center items-center w-[500px] h-auto">
                  <img
                    :src="helpPages[currentPage]"
                    alt="Help Page"
                    class="w-full h-auto"
                  />
                </div>
                <button
                  @click="nextPage"
                  :disabled="currentPage === helpPages.length - 1"
                  :class="currentPage < helpPages.length - 1 ? '' : 'invisible'"
                  class="p-2 transition duration-300 ease-in-out transform hover:scale-110"
                >
                  <img :src="nextrighticon" alt="Next" class="w-10 h-10" />
                </button>
              </div>
            </div>
          </div>

          <button @click="toggleSound">
            <img
              :src="soundButton"
              alt="Sound Button"
              class="w-[50px] h-[50px] mr-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110"
            />
          </button>
          <div v-show="isVolumeVisible" class="volume-control">
            <div class="volume-icon">
              <img :src="volumeUp" alt="volume-up" />
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model="volume"
              class="volume-slider"
            />
            <div class="volume-icon">
              <img :src="volumeDown" alt="volume-down" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center">
        <div
          v-for="(row, rowIndex) in splitWords"
          :key="rowIndex"
          class="flex flex-row gap-2 mb-8"
        >
          <button
            v-for="item in row"
            :key="item.index"
            @click="selectLetter(item.letter, item.index)"
            :disabled="clickedLetters[item.index]"
            :class="[
              'text-[40px]',
              'text-[#FEF9EF]',
              'rounded-2xl',
              'w-20',
              'h-20',
              'hover:bg-[#09897c]',
              clickedLetters[item.index] ? 'bg-[#09897c]' : 'bg-[#19C3B2]'
            ]"
          >
            {{ item.letter.toUpperCase() }}
          </button>
        </div>
        <div class="flex flex-row gap-2 mt-10">
          <div
            v-for="(item, index) in selectedAnswer"
            :key="index"
            :class="[
              usedHintIndexes.includes(index)
                ? 'hinted-box'
                : !item
                  ? 'unfilled-box'
                  : 'filled-box',
              selectedAnswerStatus === 'correct'
                ? 'correct-box'
                : selectedAnswerStatus === 'incorrect'
                  ? 'incorrect-box'
                  : ''
            ]"
            class="box-base"
          >
            {{ item.toUpperCase() }}
          </div>
        </div>
      </div>

      <div class="flex justify-center items-end mb-16 gap-10">
        <button
          @click="
            clearSelectAnswer();
            playClearSound();
          "
          class="bg-[#000000] text-[#FEF9EF] text-3xl rounded-xl px-8 w-56 hover:bg-[#878787] focus:bg-black transition duration-300 ease-in-out transform hover:scale-110"
        >
          Clear
        </button>
        <button
          @click="
            useHint();
            playHintSound();
          "
          :disabled="hints === 0"
          :class="[
            'bg-[#000000] text-[#FEF9EF] text-3xl rounded-xl px-8 w-56 transition duration-300 ease-in-out transform hover:scale-110',
            hints > 0
              ? 'hover:bg-[#878787] focus:bg-black'
              : 'opacity-50 cursor-not-allowed'
          ]"
        >
          Hints ({{ hints }})
        </button>
      </div>
    </div>

    <!-- Success Page -->
    <div
      v-if="isVisible === 3"
      class="bg-[#227C9D] h-screen flex flex-col justify-start items-center"
    >
      <h2 class="text-white text-7xl mt-10 justify-start">
        {{ `Level ${level[onMode] - 1} completed !` }}
      </h2>
      <img
        :src="loadSuccess"
        alt="Prize"
        class="w-[610px] h-[600px] items-end"
      />
    </div>

    <!-- Level-up Page -->
    <div
      v-if="isVisible === 4"
      class="bg-[#227C9D] h-screen flex flex-col justify-between items-center"
    >
      <h2 class="text-white text-7xl mt-10">
        {{
          `Finished Mode ${onMode.charAt(0).toUpperCase() + onMode.slice(1)}`
        }}
      </h2>
      <img
        :src="levelSuccess"
        alt="Prize"
        class="w-[410px] h-[400px] items-end mt-[-10px]"
      />
      <button @click="modePage" class="hover:scale-150">
        <img
          :src="continueButton"
          alt="Continue"
          class="w-[150px] h-[150px] items-end mt-[-100px] hover:scale-110"
        />
      </button>
      <h2 class="text-white text-4xl mb-[60px] justify-end">
        You have received 5 additional hint.
      </h2>
    </div>

    <!-- Final Page -->
    <!-- <div v-if="isVisible === 3" class="bg-[#227C9D] h-screen flex flex-col justify-between items-center">
      <h2 class="text-white text-7xl mt-10 ">Congratulations !</h2>
      <h2 class="text-white text-2xl mt-10 ">You success 100% in this game</h2>
 
      <img :src="prizePhoto" alt="Prize" class=" w-[1500px] h-[800px] items-end mt-[-100px]">
     </div> -->
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

.volume-control {
  width: 45px;
  position: fixed;
  top: 170px;
  right: 20px;
  background-color: transparent;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.volume-slider {
  height: 140px;
  background: #ddd;
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  transform: rotate(-90deg);
}

.volume-icon img {
  width: 24px;
  height: 24px;
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
  background-color: #18d144; /* Green color */
  border: 2px solid #18d144; /* Green border */
  animation: bounce 1.5s infinite; /* ขยับขึ้นลง */
}

.incorrect-box {
  background-color: #ee6363; /* Red color */
  border: 2px solid #ee6363; /* Red border */
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
