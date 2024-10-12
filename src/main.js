import './main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './routes/pages/OriginGamePage.vue';
import router from './routes';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
