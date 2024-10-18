import { createRouter, createWebHistory } from 'vue-router';

import OriginGamePage from '../views/OriginGamePage.vue';
import MenuPage from '../views/MenuPage.vue';
import HomePage from '../views/Home/HomePage.vue';
import GamePlayPage from '../views/GamePlay/GamePlayPage.vue';
import RankBoardPage from '../views/GamePlay/RankBoardPage.vue';
import Login from '../views/Login.vue'; // Import Login component
import UserManagement from '../views/UserManagement.vue'; // Import User Management component
import CreateUser from '../views/CreateUser.vue'; // Import Create User component
import EditUser from '../views/EditUser.vue'; // Import Edit User component
import PageNotFound from '../views/PageNotFound.vue'; // Optional: Import a Not Found component

const routes = [
  {
    path: '/',
    name: 'login', // ชื่อเส้นทางใหม่สำหรับหน้า Login
    component: Login,
  },
  {
    path: '/home',
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
  {
    path: '/user-management', // Route for User Management
    name: 'user-management',
    component: UserManagement,
  },
  {
    path: '/create-user', // Route for Create User
    name: 'create-user',
    component: CreateUser,
  },
  {
    path: '/edit-user/:id', // Route for Edit User with dynamic parameter
    name: 'edit-user',
    component: EditUser,
    props: true, // Pass route params as props to the component
  },
  {
    path: '/:catchAll(.*)', // Fallback route for 404
    name: 'page-not-found',
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
