<script setup>
import { ref, onMounted } from 'vue';
import AppControlPanel from './components/AppControlPanel.vue';
import TutorialModal from './components/Modal/TutorialModal.vue';
import MarketModal from './components/Modal/MarketModal.vue';
import SoundModal from './components/Modal/SoundModal.vue';

import { useDisclosure } from '@/utils';
import { useUserStore, useCoinStore, useHintStore, useProfileStore } from '@/stores';

const { opened, open, close } = useDisclosure();
const userStore = useUserStore();
const coinStore = useCoinStore();
const hintStore = useHintStore();
const profileStore = useProfileStore();

const currentModal = ref('');

const openModal = (modal) => {
  currentModal.value = modal;
  console.log('openModal', modal);
  open();
};

onMounted(async () => {
  await userStore.rehydrateUser();
  coinStore.initState();
  hintStore.initState();
  profileStore.initState();
});
</script>

<template>
  <div class="relative">
    <div v-if="$route.name !== 'login' && $route.name !== 'signup'">
      <app-control-panel :open-modal="openModal" />
      <market-modal :is-open="opened && currentModal === 'market'" :on-close="close" />
      <tutorial-modal :is-open="opened && currentModal === 'tutorial'" :on-close="close" />
      <sound-modal :is-open="opened && currentModal === 'sound'" :on-close="close" />
    </div>

    <router-view />
  </div>
</template>

<style>
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

.get-coin {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px; /* ขนาดของรูปภาพ */
  height: auto;
  opacity: 0; /* เริ่มจากโปร่งใส */
  transition: opacity 0.5s ease-in-out; /* ทำให้ transition นุ่มนวล */
}

.get-coin.show {
  opacity: 1; /* ทำให้ภาพปรากฏ */
  animation: fadeIn 1s ease-in-out; /* ใช้ animation ที่สร้างขึ้น */
}

.get-coin.hide {
  opacity: 0;
}

/* Keyframes สำหรับการ fade in */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px); /* ขยับตำแหน่งเล็กน้อย */
  }
  100% {
    opacity: 1;
    transform: translateY(0); /* กลับไปที่ตำแหน่งเดิม */
  }
}
</style>
