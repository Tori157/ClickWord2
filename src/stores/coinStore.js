import { defineStore, acceptHMRUpdate } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useUserStore } from './userStore';
import getcoin1 from '/assets/images/getcoin1.png';
import getcoin2 from '/assets/images/getcoin2.png';
import getcoin4 from '/assets/images/getcoin4.png';

export const useCoinStore = defineStore('coins', () => {
  const coins = ref(0);
  const receivedCoinImagePath = ref(null);
  const shouldDisplayReceivedCoin = ref(false);

  const initState = () => {
    const { user } = useUserStore();

    if (user) {
      coins.value = user.gameStats.coins;
    }
  };

  const increment = (number = 1) => {
    coins.value += number;
    displayReceivedCoin(number);
  };

  const decrement = (number = 1) => {
    if (coins.value >= number) {
      coins.value -= number;
    }
  };

  const formattedCoin = computed(() => `${coins.value.toLocaleString()} $`);

  const displayReceivedCoin = (number) => {
    if (number === 1) receivedCoinImagePath.value = getcoin1;
    else if (number === 2) receivedCoinImagePath.value = getcoin2;
    else if (number === 4) receivedCoinImagePath.value = getcoin4;

    shouldDisplayReceivedCoin.value = true;

    setTimeout(() => {
      shouldDisplayReceivedCoin.value = false;
    }, 3000); // Image will display for 3 seconds
  };

  watch(coins, (newValue) => {
    const { user, setUser } = useUserStore();

    if (user) {
      setUser({ ...user, gameStats: { ...user.gameStats, coins: newValue } });
    }
  });

  return {
    coins,
    initState,
    increment,
    decrement,
    formattedCoin,
    receivedCoinImagePath,
    shouldDisplayReceivedCoin,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCoinStore, import.meta.hot));
}
