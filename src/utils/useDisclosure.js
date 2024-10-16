import { ref, computed } from 'vue';

export function useDisclosure(initialState = false) {
  const opened = ref(initialState);

  const open = () => {
    if (!opened.value) {
      opened.value = true;
    }
  };

  const close = () => {
    if (opened.value) {
      opened.value = false;
    }
  };

  const toggle = () => {
    opened.value ? close() : open();
  };

  return { opened: computed(() => opened.value), open, close, toggle };
}
