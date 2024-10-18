// coinStore.js

import { defineStore, acceptHMRUpdate } from 'pinia';

const COIN_KEY_STORAGE = 'coin';

export const useCoinStore = defineStore('coin', {
  state: () => ({
    coin: Number(localStorage.getItem(COIN_KEY_STORAGE)) || 0,
  }),

  actions: {
    increment(number = 1) {
      this.coin += number;
      this.saveToLocalStorage();
    },

    decrement(number = 1) {
      if (this.coin >= number) {
        this.coin -= number; //
        this.saveToLocalStorage();
      }
    },

    saveToLocalStorage() {
      localStorage.setItem(COIN_KEY_STORAGE, this.coin);
    },
  },

  getters: {
    formattedCoin: (state) => `${state.coin} $`,

    isEmpty: (state) => state.coin === 0,
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCoinStore, import.meta.hot));
}
