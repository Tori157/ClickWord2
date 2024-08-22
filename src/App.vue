<script setup>
import playButton from "./components/icons/play.png";
import bulb from "./components/icons/bulb.png";
import prize from "./components/icons/prize.png";
import back from "./components/icons/back.png";
import homeButton from "./components/icons/HomeButton.png";
import helpButton from "./components/icons/helpButton.png";
import soundButton from "./components/icons/soundButton.png";
import loadSuccess from "./components/icons/loadPhoto.png";
import levelSuccess from "./components/icons/level-up-photo.png";
import prizePhoto from "./components/icons/prizePhoto.png";
import Questions from "./data/word_levels.json";

import { ref, computed, watch } from "vue";

const isVisible = ref(0);
const level = ref(0);
const selectedWord = ref([]);
const selectedAnswer = ref([]);
const count = ref(0);
const correctAnswer = ref([]);
const boxAnswerLength = ref(0);
const hints = ref(300);
const usedHintIndexes = ref([]);
const clickedLetters = ref({});
const onMode = ref("");

const modePage = () => {
  isVisible.value = 1;
  clearLevel();
};

const startPage = () => {
  isVisible.value = 0;
};

const gamePlayPage = () => {
  isVisible.value = 2;
};

const successPage = () => {
  isVisible.value = 3;
};

const playMode = () => {
  gamePlayPage();
  clearSelectAnswer();

  const filterquestions = Questions.filter(
    (q) => q.difficulty === onMode.value,
  );
  const randomIndex = Math.floor(Math.random() * filterquestions.length);
  const question = filterquestions[randomIndex];

  selectedWord.value = shuffleArray(question.word.split(""));
  boxAnswerLength.value = selectedWord.value.length;
  correctAnswer.value = question.correctAnswer.split("");
  selectedAnswer.value = Array(boxAnswerLength.value).fill("");
};

const playEasyMode = () => {
  onMode.value = "easy";
  playMode();
};
const playMediumMode = () => {
  onMode.value = "medium";
  playMode();
};
const playHardMode = () => {
  onMode.value = "hard";
  playMode();
};

const selectLetter = (letter, index) => {
  if (
    filledBoxLength.value < selectedAnswer.value.length &&
    !clickedLetters.value[index]
  ) {
    const firstEmptyIndex = selectedAnswer.value.findIndex(
      (char) => char === "",
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
    (char, index) => char === flattenedSelectedAnswer[index],
  );

  if (isCorrect) {
    console.log("you win");
    level.value += 1;
    playMode();
    selectedAnswer.value = Array(boxAnswerLength.value).fill("");
  } else {
    console.log("you lose");
  }
};

function shuffleArray(arr) {
  let shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const clearSelectAnswer = () => {
  usedHintIndexes.value.length = 0;
  selectedAnswer.value = Array(boxAnswerLength.value).fill("");
  clickedLetters.value = {};
};

const clearLevel = () => {
  level.value = 0;
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
  () => selectedAnswer.value.filter((l) => /^[a-zA-Z]+$/.test(l)).length,
);

const useHint = () => {
  if (hints.value > 0 && filledBoxLength.value < correctAnswer.value.length) {
    const availableIndexes = Array.from(
      { length: correctAnswer.value.length },
      (_, i) => i,
    ).filter((e) => !usedHintIndexes.value.includes(e));

    const randomOfAvailable = Math.floor(
      Math.random() * availableIndexes.length,
    );
    const randomIndex = availableIndexes[randomOfAvailable];
    
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
  },
);
</script>

<template>
  <div>
    <!-- Start Page -->
    <div
      v-if="isVisible === 0"
      class="bg-[#FEF9EF] flex flex-col items-center justify-center h-screen"
    >
      <h1 class="text-[150px] justify-start text-[#237C9D] mt-[-75px]">
        CLICK WORD
      </h1>
      <button @click="modePage">
        <img
          :src="playButton"
          alt="Play Button"
          class="w-60 h-60 mx-auto mb-[50px] mt-10 hover:scale-110"
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
            Success (0%)
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
      <h1 class="text-[130px] justify-start text-[#237C9D]">MODE</h1>
      <div class="flex flex-col gap-6">
        <button
          @click="playEasyMode"
          class="bg-[#19C3B2] text-[#FEF9EF] text-[40px] rounded-2xl px-8 hover:scale-110 hover:bg-[#20a396]"
        >
          Easy
        </button>
        <button
          @click="playMediumMode"
          class="bg-[#FFCB77] text-[#FEF9EF] text-[40px] rounded-2xl px-8 hover:scale-110 hover:bg-[#ffb031]"
        >
          Medium
        </button>
        <button
          @click="playHardMode"
          class="bg-[#FE6D73] text-[#FEF9EF] text-[40px] rounded-2xl px-8 hover:scale-110 hover:bg-[#ee464c]"
        >
          Hard
        </button>
        <button @click="startPage">
          <img
            :src="back"
            alt="Back Button"
            class="w-20 h-20 mx-auto my-auto mb-1 mt-16 hover:scale-150"
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
            class="w-[50px] h-[50px] ml-5 mt-5 hover:scale-110"
          />
        </button>
        <h3 class="mt-6 text-4xl text-black">{{ `Level ${level + 1}` }}</h3>
        <div class="flex flex-col">
          <button @click="successPage">
            <img
              :src="helpButton"
              alt="Help Button"
              class="w-[50px] h-[50px] mr-5 mt-5 hover:scale-110"
            />
          </button>
          <button @click="modePage">
            <img
              :src="soundButton"
              alt="Sound Button"
              class="w-[50px] h-[50px] mr-5 mt-5 hover:scale-110"
            />
          </button>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center flex-1 gap-8">
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
            class="text-[40px] text-[#FEF9EF] rounded-2xl w-20 h-20 bg-[#19C3B2]"
          >
            {{ item.letter }}
          </button>
        </div>
        <div class="flex flex-row gap-2 mb-8">
          <div
            v-for="(item, index) in selectedAnswer"
            :key="index"
            :class="[usedHintIndexes.includes(index) ? 'bg-[#FFCB77]' : '']"
            class="text-[40px] text-black flex justify-center items-center w-20 h-20 border-2 border-[#19C3B2] rounded-2xl"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <div class="flex justify-center items-end mb-16 gap-10">
        <button
          @click="clearSelectAnswer"
          class="bg-[#000000] text-[#FEF9EF] text-3xl rounded-xl px-8 w-56 hover:bg-[#878787] focus:bg-black"
        >
          Clear
        </button>
        <button
          @click="useHint"
          class="bg-[#000000] text-[#FEF9EF] text-3xl rounded-xl px-8 w-56 hover:bg-[#878787] focus:bg-black"
        >
          Hints ({{ hints }})
        </button>
      </div>
    </div>

    <!-- Success Page -->
    <!-- <div v-if="isVisible === 3" class="bg-[#227C9D] h-screen flex flex-col justify-start items-center">
      <h2 class="text-white text-7xl mt-10 justify-start">Level 1 Completed !!</h2>
      <img :src="loadSuccess" alt="Prize" class=" w-[610px] h-[600px] items-end">
     </div> -->

    <!-- Level-up Page -->
    <!-- <div v-if="isVisible === 3" class="bg-[#227C9D] h-screen flex flex-col justify-between items-center">
      <h2 class="text-white text-7xl mt-10 ">Finished Mode Easy</h2>
      <img :src="levelSuccess" alt="Prize" class=" w-[410px] h-[400px] items-end mt-[-10px]">
      <button class="hover:scale-120"><img :src="continueButton" alt="Prize" class=" w-[150px] h-[150px] items-end mt-[-100px]"></button>
      <h2 class="text-white text-4xl mb-[60px] justify-end">You have received 5 additional hint.</h2>
    </div> -->

    <!-- Final Page -->
    <!-- <div v-if="isVisible === 3" class="bg-[#227C9D] h-screen flex flex-col justify-between items-center">
      <h2 class="text-white text-7xl mt-10 ">Congratulations !</h2>
      <h2 class="text-white text-2xl mt-10 ">You success 100% in this game</h2>

      <img :src="prizePhoto" alt="Prize" class=" w-[1500px] h-[800px] items-end mt-[-100px]">
     </div> -->
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Itim&display=swap");

h1 {
  font-family: "Irish Grover", sans-serif;
  font-weight: 500;
  font-style: normal;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  /* เงาที่ตัวอักษร */
}

* {
  font-family: "Itim", cursive;
  font-weight: 400;
  font-style: normal;
}
</style>
