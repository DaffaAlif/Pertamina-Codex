import { createApp } from 'vue';
import App from './App.vue';
import { createSimpleRouter } from './router/simpleRouter.js';

const app = createApp(App);
const router = createSimpleRouter();

app.use(router);
app.mount('#app');
