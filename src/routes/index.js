import { createRouter, createWebHistory } from 'vue-router';

import OriginGamePage from '../views/OriginGamePage.vue';
import MenuPage from '../views/MenuPage.vue';
import HomePage from '../views/Home/HomePage.vue';
import GamePlayPage from '../views/GamePlay/GamePlayPage.vue';
import RankBoardPage from '../views/GamePlay/RankBoardPage.vue';

const routes = [
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
    path: '/origin',
    name: 'origin-game-page',
    component: OriginGamePage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
