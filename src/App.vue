<script setup>
import playButton from './components/icons/play.png'
import bulb from './components/icons/bulb.png'
import prize from './components/icons/prize.png'
import Questions from '../Questions.json'

import { ref } from 'vue'

const isVisible = ref(0)
const level = ref(0)
const selectedWord = ref([])
const selectedAnswer = ref([])
const spaceCount = ref(0)
const count = ref(0)
const correctAnswer = ref([])
const col = ref(0)

const modePage = () => {
  isVisible.value = 1
}

const playMode = (difficulty) => {
  isVisible.value = 2
  const question = Questions.filter((q) => q.difficulty === difficulty)[
    level.value
  ]
  selectedWord.value = shuffleArray(question.word.split(''))
  spaceCount.value = selectedWord.value.length
  col.value = selectedWord.value.length
  correctAnswer.value = question.correctAnswer.split('')
  selectedAnswer.value = Array(spaceCount.value).fill(' ')

  console.log(selectedAnswer.value)
}

const playEasyMode = () => playMode('easy')
const playMediumMode = () => playMode('medium')
const playHardMode = () => playMode('hard')

const selectLetter = (letter) => {
  if (count.value < selectedAnswer.value.length) {
    selectedAnswer.value[count.value] = letter
    count.value += 1

    if (count.value >= correctAnswer.value.length) {
      checkAnswer()
    }
  }
}

const checkAnswer = () => {
  const isCorrect = correctAnswer.value.every(
    (char, index) => char === selectedAnswer.value[index]
  )

  if (isCorrect) {
    console.log('you win')
  } else {
    console.log('you lose')
  }
}

function shuffleArray(arr) {
  let shuffled = arr.slice() // Create a copy of the array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] // Swap elements
  }
  return shuffled
}
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
            alt="Play Button"
            class="w-20 h-20 mx-auto my-auto mb-1"
          />
          <h3 class="bg-[#19C3B2] text-[#FEF9EF] text-[20px] rounded-2xl p-3">
            Success (0%)
          </h3>
        </div>
        <div class="flex flex-col item-center gap-2">
          <img
            :src="bulb"
            alt="Play Button"
            class="w-20 h-20 mx-auto my-auto mb-1 mr-3"
          />
          <h3 class="bg-[#FF9090] text-[#FEF9EF] text-[20px] rounded-2xl p-3">
            Hints (3)
          </h3>
        </div>
      </div>
    </div>

    <!-- Mode Page -->
    <div
      v-if="isVisible === 1"
      class="bg-[#FEF9EF] flex flex-col items-center justify-center h-screen gap-20"
    >
      <h1 class="text-[130px] justify-start text-[#237C9D] mt-[-200px]">
        MODE
      </h1>
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
      </div>
    </div>

    <!-- Play Page -->
    <div
      v-if="isVisible === 2"
      class="bg-[#FEF9EF] flex flex-col items-center justify-center h-screen gap-8 text-[#FEF9EF]"
    >
      <div :class="`grid grid-cols-${col} gap-2 mb-8`">
        <button
          v-for="word in selectedWord"
          :key="word"
          @click="selectLetter(word)"
          class="text-[40px] rounded-2xl w-20 h-20 bg-[#19C3B2]"
        >
          {{ word }}
        </button>
      </div>
      <div :class="`grid grid-cols-${col} gap-2 mb-8`">
        <div
          v-for="item in selectedAnswer"
          :key="item"
          class="text-[40px] text-black flex justify-center items-center w-20 h-20 border-2 border-[#19C3B2] rounded-2xl"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Itim&display=swap');

h1 {
  font-family: 'Irish Grover', sans-serif;
  font-weight: 500;
  font-style: normal;
}

* {
  font-family: 'Itim', cursive;
  font-weight: 400;
  font-style: normal;
}
</style>
