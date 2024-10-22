import { ref, computed } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';

const HINT_KEY_STORAGE = 'hint';

export const useHintStore = defineStore('hint', () => {
  const hint = ref(Number(localStorage.getItem(HINT_KEY_STORAGE)) || 1000);

  const isEmpty = computed(() => hint.value === 0);

  const increment = (number = 1) => {
    hint.value += number;
    localStorage.setItem(HINT_KEY_STORAGE, hint.value);
  };

  const decrement = (number = 1) => {
    hint.value -= number;
    localStorage.setItem(HINT_KEY_STORAGE, hint.value);
  };

  return { hint, isEmpty, increment, decrement };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHintStore, import.meta.hot));
}
