import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';

const FRAMES_KEY_STORAGE = 'purchasedFrames';

export const useProfileStore = defineStore('profileStore', () => {
  const purchasedFrames = ref(JSON.parse(localStorage.getItem(FRAMES_KEY_STORAGE)) || []);

  const addPurchasedFrame = (frame) => {
    if (!purchasedFrames.value.includes(frame)) {
      purchasedFrames.value.push(frame);
      saveToLocalStorage();
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(FRAMES_KEY_STORAGE, JSON.stringify(purchasedFrames.value));
  };

  return {
    purchasedFrames,
    addPurchasedFrame,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfileStore, import.meta.hot));
}
