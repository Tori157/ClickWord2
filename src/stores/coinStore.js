import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';
import getcoin1 from '@/../public/assets/images/getcoin1.png';
import getcoin2 from '@/../public/assets/images/getcoin2.png';
import getcoin4 from '@/../public/assets/images/getcoin4.png';

const COIN_KEY_STORAGE = 'coin';

export const useCoinStore = defineStore('coin', () => {
  const coin = ref(Number(localStorage.getItem(COIN_KEY_STORAGE)) || 1000);
  const getCoinImage = ref(null);
  const showGetCoinImage = ref(false);

  const increment = (number = 1) => {
    coin.value += number;
    saveToLocalStorage();
    displayGetCoinImage(number);
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

  const displayGetCoinImage = (number) => {
    if (number === 1) getCoinImage.value = getcoin1;
    else if (number === 2) getCoinImage.value = getcoin2;
    else if (number === 4) getCoinImage.value = getcoin4;

    showGetCoinImage.value = true;

    setTimeout(() => {
      showGetCoinImage.value = false;
    }, 3000); // ภาพจะหายไปหลัง 3 วินาที
  };

  return {
    coin,
    increment,
    decrement,
    formattedCoin,
    getCoinImage,
    showGetCoinImage,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCoinStore, import.meta.hot));
}
