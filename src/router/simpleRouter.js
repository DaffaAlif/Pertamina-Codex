import { computed, inject, ref } from 'vue';

const ROUTE_SYMBOL = Symbol('simple-route');
const ROUTER_SYMBOL = Symbol('simple-router');

const DATASET_PREFIX = '/datasets/';
const CATEGORY_PREFIX = '/categories/';

function parseRoute(path) {
  if (path.startsWith(DATASET_PREFIX)) {
    const datasetId = decodeURIComponent(path.slice(DATASET_PREFIX.length));
    return {
      name: 'dataset-detail',
      params: { datasetId },
      path,
    };
  }

  if (path.startsWith(CATEGORY_PREFIX)) {
    const categoryId = decodeURIComponent(path.slice(CATEGORY_PREFIX.length));
    return {
      name: 'category-detail',
      params: { categoryId },
      path,
    };
  }

  return {
    name: 'dashboard',
    params: {},
    path,
  };
}

export function createSimpleRouter() {
  const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const currentPath = ref(initialPath || '/');

  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      currentPath.value = window.location.pathname || '/';
    });
  }

  const route = computed(() => parseRoute(currentPath.value));

  const push = (path) => {
    if (typeof window === 'undefined') return;
    if (path === currentPath.value) return;
    window.history.pushState({}, '', path);
    currentPath.value = path;
  };

  const replace = (path) => {
    if (typeof window === 'undefined') return;
    if (path === currentPath.value) return;
    window.history.replaceState({}, '', path);
    currentPath.value = path;
  };

  const install = (app) => {
    app.provide(ROUTE_SYMBOL, route);
    app.provide(ROUTER_SYMBOL, { push, replace });
  };

  return { install, route, push, replace };
}

export function useRoute() {
  const route = inject(ROUTE_SYMBOL);
  if (!route) {
    throw new Error('useRoute must be used after installing the simple router.');
  }
  return route;
}

export function useRouter() {
  const router = inject(ROUTER_SYMBOL);
  if (!router) {
    throw new Error('useRouter must be used after installing the simple router.');
  }
  return router;
}

export function buildPathFromRoute(to) {
  if (typeof to === 'string') {
    return to;
  }

  if (!to || typeof to !== 'object') {
    return '/';
  }

  if (to.path) {
    return to.path;
  }

  if (to.name === 'dataset-detail' && to.params?.datasetId) {
    return `${DATASET_PREFIX}${encodeURIComponent(to.params.datasetId)}`;
  }

  if (to.name === 'category-detail' && to.params?.categoryId) {
    return `${CATEGORY_PREFIX}${encodeURIComponent(to.params.categoryId)}`;
  }

  return '/';
}
