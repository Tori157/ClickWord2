import { createRouter, createWebHistory } from 'vue-router';

// นำเข้าส่วนประกอบต่าง ๆ
import OriginGamePage from '../views/OriginGamePage.vue';
import MenuPage from '../views/MenuPage.vue';
import HomePage from '../views/Home/HomePage.vue';
import GamePlayPage from '../views/GamePlay/GamePlayPage.vue';
import RankBoardPage from '../views/GamePlay/RankBoardPage.vue';
import Login from '../views/Login.vue'; // นำเข้าส่วนประกอบ Login
import CreateUser from '../views/CreateUser.vue'; // นำเข้าส่วนประกอบ Create User
import EditUser from '../views/EditUser.vue'; // นำเข้าส่วนประกอบ Edit User
import PageNotFound from '../views/PageNotFound.vue'; // นำเข้าส่วนประกอบ Not Found

// กำหนดเส้นทาง (routes)
const routes = [
  {
    path: '/',
    name: 'login', // ชื่อเส้นทางสำหรับหน้า Login
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
    path: '/create-user', // เส้นทางสำหรับสร้างผู้ใช้
    name: 'create-user',
    component: CreateUser,
  },
  {
    path: '/edit-user/:username', // เส้นทางสำหรับแก้ไขผู้ใช้ โดยมีพารามิเตอร์ที่เปลี่ยนแปลงได้
    name: 'edit-user',
    component: EditUser,
    
  },
  {
    path: '/:catchAll(.*)', // เส้นทางสำหรับ 404 Not Found
    name: 'page-not-found',
    component: PageNotFound,
  },
];

// สร้าง router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// ส่งออก router
export default router;
