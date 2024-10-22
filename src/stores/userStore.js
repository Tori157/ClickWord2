import { ref, computed } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import UserApi from '@/api/userApi';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);

  const isLoggedIn = computed(() => !!user.value);

  const initUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    user.value = await UserApi.getUser(token);
  };

  const setUser = (newUser) => {
    user.value = newUser;
    localStorage.setItem('token', newUser.id);
  };

  const clearUser = () => {
    user.value = null;
    localStorage.removeItem('token');
  };

  return { user, isLoggedIn, initUser, setUser, clearUser };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
