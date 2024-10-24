import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores';

import MenuPage from '../views/Menu/MenuPage.vue';
import HomePage from '../views/Home/HomePage.vue';
import GamePlayPage from '../views/GamePlay/GamePlayPage.vue';
import RankBoardPage from '../views/GamePlay/RankBoardPage.vue';
import Login from '../views/User/Login.vue';
import CreateUser from '../views/User/CreateUser.vue';
import EditUser from '../views/User/EditUser.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    name: 'home-page',
    component: HomePage,
  },
  {
    path: '/menu',
    name: 'menu-page',
    component: MenuPage,
  },
  {
    path: '/game',
    name: 'game-play-page',
    component: GamePlayPage,
  },
  {
    path: '/rank-board',
    name: 'rank-board-page',
    component: RankBoardPage,
  },
  {
    path: '/signup',
    name: 'signup',
    component: CreateUser,
  },
  {
    path: '/edit-user/:username',
    name: 'edit-user',
    component: EditUser,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _, next) => {
  if (to.name === 'login' || to.name === 'signup') {
    next();
  } else {
    const userStore = useUserStore();
    await userStore.initUser();

    if (!userStore.isLoggedIn) {
      next({ name: 'login' });
    } else {
      next();
    }
  }
});

export default router;
