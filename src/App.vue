<template>
  <LoginPage v-if="!isAuthenticated" @authenticated="handleAuthenticated" />
  <component v-else :is="activeComponent" v-bind="activeProps" />
</template>

<script setup>
import { computed, ref } from 'vue';
import DashboardPage from './pages/DashboardPage.vue';
import DatasetDetailPage from './pages/DatasetDetailPage.vue';
import LoginPage from './pages/LoginPage.vue';
import { useRoute, useRouter } from './router/simpleRouter.js';

const isAuthenticated = ref(false);
const route = useRoute();
const router = useRouter();

const activeComponent = computed(() => {
  if (route.value.name === 'dataset-detail') {
    return DatasetDetailPage;
  }
  return DashboardPage;
});

const activeProps = computed(() => {
  if (route.value.name === 'dataset-detail') {
    return { datasetId: route.value.params.datasetId };
  }
  return {};
});

const handleAuthenticated = () => {
  isAuthenticated.value = true;
  if (route.value.name !== 'dataset-detail') {
    router.replace('/');
  }
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
  background: linear-gradient(120deg, #e0f2fe 0%, #f8fafc 30%, #eff6ff 100%);
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
