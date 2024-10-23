import { ref, computed, watch } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useUserStore } from './userStore';

export const useHintStore = defineStore('hints', () => {
  const hints = ref(3);

  const isEmpty = computed(() => hints.value === 0);

  const initState = () => {
    const { user } = useUserStore();

    if (user) {
      hints.value = user.gameStats.hints;
    }
  };

  const increment = (number = 1) => {
    hints.value += number;
  };

  const decrement = (number = 1) => {
    hints.value -= number;
  };

  watch(hints, (newHints) => {
    const { user, setUser } = useUserStore();

    if (user) {
      setUser({ ...user, gameStats: { ...user.gameStats, hints: newHints } });
    }
  });

  return { hints, isEmpty, initState, increment, decrement };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHintStore, import.meta.hot));
}
