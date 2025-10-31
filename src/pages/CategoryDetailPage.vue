<template>
  <main class="flex min-h-screen w-full flex-col">
    <AppHeader />

    <section v-if="category" class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <div class="rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-xl shadow-brand-dark/10 backdrop-blur">
        <button
          type="button"
          class="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          @click="goBack"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" class="h-4 w-4">
            <path d="M9.78 3.97a.75.75 0 0 1 0 1.06L6.06 8.75l3.72 3.72a.75.75 0 1 1-1.06 1.06L4.47 9.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" fill="currentColor" />
          </svg>
          <span>Back to Discover</span>
        </button>

        <p class="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Category</p>
        <h1 id="category-detail-heading" class="mt-2 text-3xl font-semibold text-brand-dark sm:text-4xl">
          {{ category.name }}
        </h1>
        <p class="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{{ categorySummary }}</p>

        <div class="mt-6 flex flex-wrap gap-3 text-sm text-slate-600" role="list">
          <span role="listitem" class="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1">
            <strong class="font-semibold text-brand-dark">{{ datasetCountLabel }}</strong> curated datasets
          </span>
          <span
            v-if="category.datasets"
            role="listitem"
            class="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1"
          >
            <strong class="font-semibold text-brand-dark">{{ category.datasets }}</strong> total assets cataloged
          </span>
        </div>
      </div>

      <div v-if="categoryDatasets.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list">
        <article
          v-for="dataset in categoryDatasets"
          :key="dataset.id"
          class="group flex cursor-pointer flex-col gap-4 rounded-2xl border border-slate-300/40 bg-gradient-to-br from-slate-200/40 via-slate-100/80 to-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:-translate-y-1 focus-visible:shadow-xl focus-visible:ring-2 focus-visible:ring-brand-primary/50"
          role="listitem"
          tabindex="0"
          :aria-label="`Open ${dataset.title}`"
          @click="openDataset(dataset.id)"
          @keyup.enter="openDataset(dataset.id)"
          @keyup.space.prevent="openDataset(dataset.id)"
        >
          <header class="flex items-center justify-between gap-3">
            <span class="text-xs font-bold uppercase tracking-[0.12em] text-brand-dark">{{ dataset.domain }}</span>
            <span class="text-xs font-medium text-slate-500">Updated {{ formatDate(dataset.lastUpdated) }}</span>
          </header>

          <h2 class="text-lg font-semibold text-brand-dark">{{ dataset.title }}</h2>
          <p class="text-sm leading-relaxed text-slate-600">{{ dataset.summary }}</p>

          <ul class="flex flex-wrap gap-2" role="list">
            <li
              v-for="tag in dataset.tags"
              :key="tag"
              role="listitem"
              class="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary"
            >
              {{ tag }}
            </li>
          </ul>

          <footer class="mt-auto flex items-end justify-between gap-3">
            <div class="flex flex-col gap-1">
              <span class="text-xl font-bold text-brand-dark">{{ dataset.heroStat }}</span>
              <span class="text-xs font-medium text-slate-500">{{ dataset.heroLabel }}</span>
            </div>

            <div class="inline-flex items-center gap-2 text-sm font-semibold text-sky-600" aria-hidden="true">
              <span>View dataset</span>
              <svg viewBox="0 0 16 16" class="h-4 w-4">
                <path d="M5.22 3.97a.75.75 0 0 1 1.06 0L10 7.69 6.28 11.4a.75.75 0 1 1-1.06-1.06l2.47-2.47-2.47-2.46a.75.75 0 0 1 0-1.06Z" fill="currentColor" />
              </svg>
            </div>
          </footer>
        </article>
      </div>

      <p
        v-else
        class="rounded-3xl border border-dashed border-slate-300/70 bg-white/80 p-6 text-center text-sm text-slate-500"
      >
        No datasets are currently mapped to this category. Please check back later.
      </p>
    </section>

    <section v-else class="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-6 py-16 text-center">
      <div class="rounded-3xl border border-slate-200/70 bg-white/95 p-10 shadow-xl shadow-brand-dark/10 backdrop-blur">
        <h1 class="text-3xl font-semibold text-brand-dark">Category not found</h1>
        <p class="mt-3 text-sm text-slate-600">
          The category you are looking for is not available. Return to the dashboard to browse the catalog.
        </p>
        <button
          type="button"
          class="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          @click="goBack"
        >
          Back to Discover
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';
import { computed } from 'vue';
import { datasetCategories, datasets } from '../data/datasets.js';
import { useRouter } from '../router/simpleRouter.js';

const props = defineProps({
  categoryId: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const category = computed(() => datasetCategories.find((entry) => entry.id === props.categoryId));

const categoryDatasets = computed(() => {
  if (!category.value) {
    return [];
  }

  return datasets.filter((dataset) => {
    if (dataset.categoryId) {
      return dataset.categoryId === category.value.id;
    }

    if (dataset.domain) {
      return dataset.domain.toLowerCase() === category.value.name.toLowerCase();
    }

    return false;
  });
});

const datasetCountLabel = computed(() => {
  const count = categoryDatasets.value.length;
  return `${count} ${count === 1 ? 'Dataset' : 'Datasets'}`;
});

const categorySummary = computed(() => {
  if (!category.value) {
    return '';
  }

  return `Explore data products supporting ${category.value.name.toLowerCase()} initiatives and decision-making.`;
});

const goBack = () => {
  router.push('/');
};

const openDataset = (datasetId) => {
  if (!datasetId) return;
  router.push(`/datasets/${encodeURIComponent(datasetId)}`);
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>
