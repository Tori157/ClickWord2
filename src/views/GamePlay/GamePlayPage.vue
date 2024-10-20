<script setup>
import { ref, reactive, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisclosure } from '@/utils';
import { useHintStore } from '@/stores';
import { useCoinStore } from '@/stores';

import LevelCompletePage from '../../views/CutScene/LevelCompletedPage.vue';
import ModeCompletePage from '../../views/CutScene/ModeCompletedPage.vue';
import GameCompletedPage from '../../views/CutScene/GameCompletedPage.vue';

import QueueManager from '@/class/QueueManager';
import '@/extensions/array';

import HomeIcon from '/public/assets/icons/HomeButton.png';

import Questions from '@/data/word_levels.json';
import TimeIcon from '/public/assets/icons/timeicon.png';

// Use this with cut scene components
const { opened, open, close } = useDisclosure();
const currentCutScene = ref('');

const {
  query: { mode },
} = useRoute();
const router = useRouter();

const hintStore = useHintStore();
const coinStore = useCoinStore();

const success = ref(Number(localStorage.getItem('userSuccess')) ?? 0);
const onMode = ref('');
const selectedAnswerStatus = ref('');
const boxAnswerLength = ref(0);

const answerHistory = JSON.parse(localStorage.getItem('answerHistory')) || {};
const level = reactive(JSON.parse(localStorage.getItem('level')) ?? { easy: 1, medium: 1, hard: 1 });

const filteredWordCollection = ref([]);
const correctAnswer = ref([]);
const selectedWord = ref([]);

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

const filledBoxLength = computed(() => selectedAnswer.value.filter((ans) => ans.reserved).length);

const maxLevels = {
  easy: 3,
  medium: 3,
  hard: 3,
};
const queueManager = new QueueManager('wordQueue', Questions, maxLevels);

const saveToLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

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

const findIndexOfFirstEmpty = (arr, key) => arr.findIndex((e) => !e[key]);

const selectLetter = (index) => {
  if (filledBoxLength.value < selectedAnswer.value.length) {
    const indexOfFirstEmpty = findIndexOfFirstEmpty(selectedAnswer.value, 'letter');

    Object.assign(selectedWord.value[index], {
      reserved: true,
      order: indexOfFirstEmpty,
    });

    // playSelectLetterSound();
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

// TODO: The logic and variables should be extracted to a separate file such as store and hook
const applyHint = () => {
  if (!hintStore.isEmpty && filledBoxLength.value < selectedAnswer.value.length) {
    const availableIndexes = selectedWord.value.map((ans, i) => (!ans.useHint ? i : -1)).filter((i) => i !== -1);
    const randomOfAvailable = Math.floor(Math.random() * availableIndexes.length);
    const randomIndex = availableIndexes[randomOfAvailable];

    Object.assign(selectedWord.value[randomIndex], {
      reserved: true,
      useHint: true,
    });

    saveAnswerHistory();

    hintStore.decrement();
  }
};

const completedGame = () => {
  const firstRoundCompleted = JSON.parse(localStorage.getItem('firstRoundCompleted'));
  if (firstRoundCompleted) {
    return Object.values(firstRoundCompleted).every((key) => key);
  }
};

const openPage = (completedType) => {
  currentCutScene.value = completedType;
  open();
};

const nextLevel = () => {
  resumeTimer();
  if (level[onMode.value] > maxLevels[onMode.value]) {
    openPage('mode-completed');
    hintStore.increment(5);
    level[onMode.value] = 1;
    saveToLocalStorage('level', level);
    return;
  }

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
  startTimer();
  nextLevel();
};

const checkAnswer = () => {
  const isCorrect = correctAnswer.value.every((char, index) => char === selectedAnswer.value[index].letter);
  if (isCorrect) {
    // ตรวจสอบว่าตัวจับเวลายังทำงานอยู่หรือไม่
    if (isTimerRunning.value) {
      saveTimerHistory(); // บันทึกตัวจับเวลาลงใน LocalStorage
    }
    stopTimer();
    selectedAnswerStatus.value = 'correct';
    const isLevelWithinMax = level[onMode.value] <= maxLevels[onMode.value];

    // playSuccessSound();
    setTimeout(() => {
      if (isLevelWithinMax) {
        level[onMode.value] += 1;
        saveToLocalStorage('level', level);

        let coinsToAdd = 0;
        if (onMode.value === 'easy') {
          coinsToAdd = 1;
        } else if (onMode.value === 'medium') {
          coinsToAdd = 2;
        } else if (onMode.value === 'hard') {
          coinsToAdd = 4;
        }

        coinStore.increment(coinsToAdd);
        openPage('level-completed');
      }
    }, 1900);
    setTimeout(() => {
      close();
      localStorage.removeItem('answerHistory');
      if (!queueManager.isFirstRoundCompleted(onMode.value) && isLevelWithinMax) {
        success.value += 1;
      }
      saveToLocalStorage('userSuccess', success.value);
      const isSuccessPendingCompletion = Math.round(success.value) === 9 && !completedGame();
      if (isSuccessPendingCompletion) {
        openPage('game-completed');
        hintStore.increment(5);
        setTimeout(() => {
          router.push({ name: 'home-page' });
        }, 1900);
      }
      queueManager.dequeue(onMode.value);
      if (!isSuccessPendingCompletion) nextLevel();
      selectedAnswerStatus.value = '';
    }, 3500);
  } else {
    selectedAnswerStatus.value = 'incorrect';
    // playFailSound();
    setTimeout(() => {
      clearSelectAnswer();
      selectedAnswerStatus.value = '';
      localStorage.removeItem('answerHistory');
    }, 1900);
  }
};

onMounted(() => {
  playOnMode(mode);
});

watch(
  () => filledBoxLength.value,
  () => {
    if (filledBoxLength.value >= selectedAnswer.value.length) {
      checkAnswer();
    }
  },
);

// ////////////////////// Start TimeBoard ///////////////////////////////////////////////////

const totalSeconds = ref(0);
const timerVar = ref(null);
const isTimerRunning = ref(false); // ใช้ตรวจสอบว่าเวลาทำงานอยู่หรือไม่

const saveTimerHistory = () => {
  const currentTimer = totalSeconds.value; // ตัวแปรจับเวลาที่ต้องการบันทึก
  saveToLocalStorage('timerHistory', currentTimer); // บันทึกเวลาลงใน LocalStorage
  console.log('time' + currentTimer);
};

// คำนวณเวลาให้แสดงผลเป็นรูปแบบ HH:MM:SS
const formattedTime = computed(() => {
  const hour = Math.floor(totalSeconds.value / 3600);
  const minute = Math.floor((totalSeconds.value % 3600) / 60);
  const seconds = totalSeconds.value % 60;

  const format = (val) => (val < 10 ? `0${val}` : val);

  return `${format(hour)}:${format(minute)}:${format(seconds)}`;
});

// ฟังก์ชันจับเวลา
function countTimer() {
  totalSeconds.value++;
}

// เริ่มจับเวลาเมื่อ component ถูก mounted
onMounted(() => {
  startTimer(); // เริ่มจับเวลาเมื่อ component โหลดเสร็จ
});

// หยุดจับเวลาเมื่อ component ถูก unmounted
onBeforeUnmount(() => {
  clearInterval(timerVar.value);
});

function startTimer() {
  if (!isTimerRunning.value) {
    // เริ่มต้นจับเวลาเมื่อฟังก์ชันถูกเรียกครั้งแรก
    timerVar.value = setInterval(countTimer, 1000);
    isTimerRunning.value = true;
  } else {
    // ดึงข้อมูล level จาก localStorage
    const levels = JSON.parse(localStorage.getItem('level'));
    console.log(levels);

    let shouldContinue = false; // ตัวแปรตรวจสอบว่าควรจะเริ่มจับเวลาต่อหรือไม่

    // วนลูปผ่าน level ที่เล่นอยู่ใน localStorage
    for (const levelType in levels) {
      const currentLevel = levels[levelType];
      console.log(`Current Level (${levelType}):`, currentLevel);

      if (currentLevel >= 1) {
        shouldContinue = true; // กำหนดให้จับเวลาต่อ
        const savedTime = parseInt(localStorage.getItem('timerHistory'), 10) || 0; // ดึงเวลาที่บันทึกไว้จาก timerHistory
        totalSeconds.value = savedTime; // ตั้งค่าเวลาใหม่
        break; // ออกจากลูปเมื่อพบ Level ที่มากกว่า 1
      }
    }
  }
}

// ฟังก์ชันหยุดจับเวลา
function stopTimer() {
  clearInterval(timerVar.value);
  isTimerRunning.value = false; // เปลี่ยนสถานะเป็นหยุดเวลา
}

// ฟังก์ชันนับเวลาต่อ
function resumeTimer() {
  if (!isTimerRunning.value) {
    startTimer(); // เริ่มนับเวลาต่อจากที่หยุดไว้
  }
}

// ฟังก์ชันสำหรับการนำทางไปที่หน้าเมนู
function goToMenuPage() {
  stopTimer();
  router.push({ name: 'menu-page' });
}
 
// ////////////////End TimeBoard ///////////////////////////////
</script>

<template>
  <div class="flex flex-col justify-between bg-[#FEF9EF] h-screen">
    <!-- Back to Menu page -->

    <button class="absolute left-2" @click="goToMenuPage">
      <img :src="HomeIcon" alt="Go to menu page"
        class="w-[50px] h-[50px] ml-5 mt-5 transition duration-300 ease-in-out transform hover:scale-110" />
    </button>

    <section id="gameplay-title-component" class="flex items-center justify-center h-[15%]">
      <!-- Display the level player is on in the current game mode -->
      <h3 class="text-4xl text-black">{{ `Level ${level[onMode]}` }}</h3>
    </section>

    <section id="gameplay-main-component" class="flex flex-col items-center justify-center h-[60%]">
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
    </section>

    <section id="gameplay-tools-component" class="flex justify-center items-end mb-6 gap-5">
      <button
        class="bg-[#000000] text-[#FEF9EF] text-3xl rounded-xl px-20 w-58 hover:bg-[#878787] focus:bg-black transition duration-300 ease-in-out transform hover:scale-110"
        @click="clearSelectAnswer(), playClearSound()"
      >
        Clear
      </button>

      <div :class="[
        'bg-[#BFBFBF] text-[#1D1B20] text-3xl rounded-xl w-58 flex items-center justify-start gap-x-[30px] pr-12 pl-8',
      ]">
        <img :src="TimeIcon" alt="Time icon" class="w-[25px] h-[25px] mr-2" />
        <div>
          <div id="timer">{{ formattedTime }}</div>
          <!-- <button type="button" id="stop_timer" @click="stopTimer">Stop time</button> -->
        </div>
      </div>
      <button :disabled="hintStore.isEmpty" :class="[
        'bg-[#000000] text-[#FEF9EF] text-3xl rounded-xl px-12 w-58 transition duration-300 ease-in-out transform hover:scale-110',
        !hintStore.isEmpty ? 'hover:bg-[#878787] focus:bg-black' : 'opacity-50 cursor-not-allowed',
      ]" @click="applyHint(), playHintSound()">

        Hints ({{ hintStore.hint }})
      </button>
    </section>

    <section id="cut-scene-pages">
      <level-complete-page
        :is-open="opened && currentCutScene === 'level-completed'"
        :on-close="close"
        :level="level"
        :on-mode="onMode"
      />
      <mode-complete-page
        :is-open="opened && currentCutScene === 'mode-completed'"
        :on-close="close"
        :on-mode="onMode"
      />
      <game-completed-page :is-open="opened && currentCutScene === 'game-completed'" :on-close="close" />
    </section>
  </div>
</template>