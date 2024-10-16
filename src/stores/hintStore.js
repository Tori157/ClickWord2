import { defineStore, acceptHMRUpdate } from 'pinia';

const HINT_KEY_STORAGE = 'hint';

export const useHintStore = defineStore('hint', {
  state: () => ({
    hint: Number(localStorage.getItem(HINT_KEY_STORAGE)) || 1000,
  }),

  actions: {
    increment(number = 1) {
      this.hint += number;
      localStorage.setItem(HINT_KEY_STORAGE, this.hint);
    },
    decrement(number = 1) {
      this.hint -= number;
      localStorage.setItem(HINT_KEY_STORAGE, this.hint);
    },
  },

  getters: {
    isEmpty() {
      return this.hint === 0;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHintStore, import.meta.hot));
}
