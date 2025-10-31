<template>
  <LoginPage v-if="!isAuthenticated" @authenticated="handleAuthenticated" />
  <component v-else :is="activeComponent" v-bind="activeProps" />
</template>

<script setup>
import { computed, ref } from 'vue';
import DashboardPage from './pages/DashboardPage.vue';
import DatasetDetailPage from './pages/DatasetDetailPage.vue';
import CategoryDetailPage from './pages/CategoryDetailPage.vue';
import LoginPage from './pages/LoginPage.vue';
import { useRoute, useRouter } from './router/simpleRouter.js';

const isAuthenticated = ref(false);
const route = useRoute();
const router = useRouter();

const activeComponent = computed(() => {
  if (route.value.name === 'dataset-detail') {
    return DatasetDetailPage;
  }

  if (route.value.name === 'category-detail') {
    return CategoryDetailPage;
  }

  return DashboardPage;
});

const activeProps = computed(() => {
  if (route.value.name === 'dataset-detail') {
    return { datasetId: route.value.params.datasetId };
  }

  if (route.value.name === 'category-detail') {
    return { categoryId: route.value.params.categoryId };
  }

  return {};
});

const handleAuthenticated = () => {
  isAuthenticated.value = true;
  if (route.value.name !== 'dataset-detail' && route.value.name !== 'category-detail') {
    router.replace('/');
  }
};
</script>
