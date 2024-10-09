import { createRouter, createWebHistory } from 'vue-router';

import OriginGamePage from './pages/OriginGamePage.vue';
import HomePage from './pages/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/origin',
    name: 'OriginGamePage',
    component: OriginGamePage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
