import { ref, computed } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import UserApi from '@/api/userApi';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const token = localStorage.getItem('token');

  const isLoggedIn = computed(() => !!user.value);

  const initUser = async () => {
    if (!token) {
      return;
    }

    user.value = await UserApi.getUser(token);
  };

  const rehydrateUser = async () => {
    if (user.value) {
      return;
    }

    await initUser();
  };

  const setUser = (newUser) => {
    user.value = newUser;
    localStorage.setItem('token', newUser.id);
  };

  const clearUser = () => {
    user.value = null;
    localStorage.removeItem('token');
  };

  return { user, isLoggedIn, initUser, rehydrateUser, setUser, clearUser };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
