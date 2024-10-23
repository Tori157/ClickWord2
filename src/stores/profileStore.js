import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, watch } from 'vue';
import { useUserStore } from './userStore';

export const useProfileStore = defineStore('profileStore', () => {
  const purchasedFrames = ref([]);

  const initState = () => {
    const { user } = useUserStore();

    if (user) {
      purchasedFrames.value = user.profile.decorations || [];
    }
  };

  const addPurchasedFrame = (frame) => {
    if (!purchasedFrames.value.includes(frame)) {
      purchasedFrames.value = [...purchasedFrames.value, frame];
    }
  };

  watch(purchasedFrames, (newFrames) => {
    const { user, setUser } = useUserStore();
    if (user) {
      user.profile.decorations = newFrames;
      setUser(user);
    }
  });

  return {
    initState,
    purchasedFrames,
    addPurchasedFrame,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfileStore, import.meta.hot));
}
