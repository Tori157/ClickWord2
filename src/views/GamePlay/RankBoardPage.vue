<script setup>
import { ref, onMounted } from 'vue';
import BackIcon from '/assets/icons/previous.png';
import { UserService } from '@/services';
import { useSoundPlayerStore } from '@/stores';

const users = ref([]);
const { playSound } = useSoundPlayerStore();

const sortUsers = (users) => {
  return users.sort((a, b) => {
    if (b.gameStats.completedPercentage !== a.gameStats.completedPercentage) {
      return b.gameStats.completedPercentage - a.gameStats.completedPercentage;
    }
    return a.gameStats.playDuration - b.gameStats.playDuration;
  });
};

const fetchUsers = async () => {
  try {
    const fetchedUsers = await UserService.loadAllUsers();
    users.value = sortUsers(fetchedUsers);
    console.log('Fetched users:', users.value);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

onMounted(fetchUsers);

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // เพิ่มเลขศูนย์หน้าเมื่อมีค่าต่ำกว่า 10
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
</script>

<template>
  <div>
    <div class="bg-[#FEF9EF] min-h-screen flex">
      <div class="flex flex-col">
        <button
          class="fixed top-4 left-5 transition duration-300 ease-in-out transform hover:scale-110"
          @click="$router.push({ name: 'home-page' }), playSound('baseClick', { reset: true })"
        >
          <img :src="BackIcon" alt="Go to menu page" class="w-[50px] h-[50px]" />
        </button>
      </div>
      <div class="flex flex-col items-center flex-grow">
        <div class="titles text-[100px] text-[#237C9D]">
          <h1>Rank Board</h1>
        </div>

        <div class="user-list mt-5 grid grid-cols-1 gap-4 mb-10">
          <div
            v-for="(user, index) in users"
            :key="index"
            :style="{
              backgroundColor: index === 0 ? '#FE6D73' : index === 1 ? '#F7B419' : index === 2 ? '#17C3B2' : '#227C9D',
            }"
            class="text-[#FEF9EF] p-4 px-32 rounded-3xl shadow-md"
          >
            <div class="flex items-center">
              <!-- แสดงลำดับอันดับ -->
              <div class="rank font-bold text-5xl mr-4">{{ index + 1 }}</div>
              <!-- เพิ่มลำดับ -->
              <img :src="user.profile.avatar" alt="Profile" class="w-16 h-16 rounded-full mr-4" />
              <div class="user-details flex-grow">
                <div class="username font-bold text-4xl">{{ user.username }}</div>
                <div class="info grid grid-cols-3 gap-2 mt-2">
                  <div class="coin font-bold text-xl">Coin: {{ user.gameStats.coins }}</div>
                  <div class="success font-bold text-xl">Success: {{ user.gameStats.completedPercentage }}%</div>
                  <div class="timerHistory font-bold text-xl">
                    Timer History: {{ formatTime(user.gameStats.playDuration) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap');

h1 {
  font-family: 'Irish Grover', sans-serif;
  font-weight: 500;
  font-style: normal;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-right: 5px;
  letter-spacing: 5px;
}

.user-item {
  display: flex;
  align-items: center;
}

.username {
  margin-left: 10px;
  font-weight: bold;
}

.info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 10px;
}

.coin,
.success,
.timerHistory {
  text-align: center;
}
</style>
