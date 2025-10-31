<template>
  <LoginPage v-if="!isAuthenticated" @authenticated="handleAuthenticated" />
  <DashboardPage v-else />
</template>

<script setup>
import { ref } from 'vue';
import DashboardPage from './pages/DashboardPage.vue';
import LoginPage from './pages/LoginPage.vue';

const isAuthenticated = ref(false);

const handleAuthenticated = () => {
  isAuthenticated.value = true;
};
</script>

<style>
:root {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #1f2937;
  background-color: #f8fafc;
  margin: 0;
}

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #e0f2fe 0%, #f8fafc 30%, #eff6ff 100%);
  padding: clamp(1.5rem, 4vw, 3rem);
}

#app {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
