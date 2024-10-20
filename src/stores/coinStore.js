import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';

const COIN_KEY_STORAGE = 'coin';

export const useCoinStore = defineStore('coin', () => {
  const coin = ref(Number(localStorage.getItem(COIN_KEY_STORAGE)) || 0);

  const increment = (number = 1) => {
    coin.value += number;
    saveToLocalStorage();
  };

  const decrement = (number = 1) => {
    if (coin.value >= number) {
      coin.value -= number;
      saveToLocalStorage();
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(COIN_KEY_STORAGE, coin.value);
  };

  const formattedCoin = () => `${coin.value} $`;

  return {
    coin,
    increment,
    decrement,
    formattedCoin,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCoinStore, import.meta.hot));
}
