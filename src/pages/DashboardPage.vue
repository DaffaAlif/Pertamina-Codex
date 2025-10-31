<template>
  <main class="flex min-h-screen w-full flex-col">
    <AppHeader />

    <section class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
      <header class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Discover</p>
          <h1 id="dashboard-heading" class="mt-1 text-3xl font-semibold text-brand-dark sm:text-4xl">
            Explore Datasets
          </h1>
        </div>

        <div class="flex flex-wrap items-center gap-4 sm:gap-6" aria-label="Filter datasets">
          <label class="relative flex min-w-[180px] items-center gap-2 rounded-full border border-slate-300/70 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <span class="sr-only">Sort by</span>
            <select
              v-model="selectedFilter"
              aria-label="Sort datasets"
              class="w-full appearance-none bg-transparent pr-6 text-sm font-medium text-slate-700 focus:outline-none"
            >
              <option v-for="option in filterOptions" :key="option">{{ option }}</option>
            </select>
            <svg viewBox="0 0 16 16" aria-hidden="true" class="pointer-events-none absolute right-3 h-4 w-4 text-slate-700">
              <path
                d="M4.47 5.03a.75.75 0 0 1 1.06 0L8 7.44l2.47-2.41a.75.75 0 1 1 1.06 1.06L8.53 8.97a.75.75 0 0 1-1.06 0L4.47 6.09a.75.75 0 0 1 0-1.06Z"
                fill="currentColor"
              />
            </svg>
          </label>

          <div class="flex flex-wrap gap-3" role="list">
            <button
              v-for="label in labels"
              :key="label"
              type="button"
              :aria-pressed="activeLabel === label"
              :class="[
                'rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
                activeLabel === label
                  ? 'border-transparent -translate-y-0.5 bg-brand-primary text-white shadow'
                  : 'border-slate-300/60 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-brand-primary/60 hover:bg-sky-50 hover:text-brand-dark',
              ]"
              @click="activeLabel = label"
            >
              {{ label }}
            </button>
          </div>
        </div>
      </header>

      <section class="flex flex-col gap-6" aria-label="Browse by category">
        <header class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-2xl font-semibold text-brand-dark sm:text-3xl">Browse by Category</h2>
          <p class="text-sm font-medium text-slate-500">{{ categories.length }} available categories</p>
        </header>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="category in categories"
            :key="category.name"
            class="group flex cursor-pointer flex-col gap-4 rounded-2xl border border-slate-300/40 bg-gradient-to-br from-slate-200/40 via-slate-100/80 to-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:-translate-y-1 focus-visible:shadow-xl"
            tabindex="0"
            role="button"
            :aria-label="`${category.name} category with ${category.datasets} datasets`"
            @click="openCategory(category)"
            @keyup.enter="openCategory(category)"
            @keyup.space.prevent="openCategory(category)"
          >
            <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary" aria-hidden="true">
              <svg v-if="category.icon === 'cog'" viewBox="0 0 48 48" class="h-8 w-8">
                <path
                  d="M24 17.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0-9a2 2 0 0 1 1.96 1.56l.54 2.4a2 2 0 0 0 1.36 1.47l2.33.77a2 2 0 0 1 1.08 2.98l-1.24 2.1a2 2 0 0 0 0 2l1.24 2.1a2 2 0 0 1-1.08 2.99l-2.33.76a2 2 0 0 0-1.36 1.47l-.54 2.41A2 2 0 0 1 24 39.5a2 2 0 0 1-1.96-1.56l-.54-2.41a2 2 0 0 0-1.36-1.47l-2.33-.76a2 2 0 0 1-1.08-2.99l1.24-2.1a2 2 0 0 0 0-2l-1.24-2.1a2 2 0 0 1 1.08-2.98l2.33-.77a2 2 0 0 0 1.36-1.47l.54-2.4A2 2 0 0 1 24 8.5Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else-if="category.icon === 'droplet'" viewBox="0 0 48 48" class="h-8 w-8">
                <path
                  d="M24 6c6.6 8.4 11 15.23 11 21.12C35 34.5 29.18 40 24 40s-11-5.5-11-12.88C13 21.23 17.4 14.4 24 6Zm0 29c3.07 0 6-2.76 6-7.88 0-3.3-2.1-7.25-6-11.93-3.9 4.68-6 8.63-6 11.93C18 32.24 20.93 35 24 35Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else-if="category.icon === 'network'" viewBox="0 0 48 48" class="h-8 w-8">
                <path
                  d="M24 9a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 11a2 2 0 0 1 2 2v5h5a2 2 0 0 1 0 4h-5v5a2 2 0 0 1-4 0v-5h-5a2 2 0 0 1 0-4h5v-5a2 2 0 0 1 2-2Z"
                  fill="currentColor"
                />
                <path
                  d="M10 21a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm28 0a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-14 14a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
                  fill="currentColor"
                  opacity="0.75"
                />
              </svg>
              <svg v-else-if="category.icon === 'radar'" viewBox="0 0 48 48" class="h-8 w-8">
                <path
                  d="M24 8a16 16 0 1 1-11.31 4.69l2.83 2.83A12 12 0 1 0 24 12v4a8 8 0 1 1-5.66 2.34l2.83 2.83A4 4 0 1 0 24 24V8Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else-if="category.icon === 'analytics'" viewBox="0 0 48 48" class="h-8 w-8">
                <path d="M12 34h4V14h-4v20Zm10 0h4V20h-4v14Zm10 0h4V10h-4v24Z" fill="currentColor" />
                <path d="M10 36h28a2 2 0 1 1 0 4H10a2 2 0 1 1 0-4Z" fill="currentColor" opacity="0.8" />
              </svg>
              <svg v-else-if="category.icon === 'shield'" viewBox="0 0 48 48" class="h-8 w-8">
                <path
                  d="m24 6 13 5v11c0 8.84-5.61 16.78-13 20-7.39-3.22-13-11.16-13-20V11l13-5Zm0 7-7 2.7V22c0 6.11 3.44 11.9 7 14.65 3.56-2.75 7-8.54 7-14.65v-6.3L24 13Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else-if="category.icon === 'globe'" viewBox="0 0 48 48" class="h-8 w-8">
                <path
                  d="M24 6a18 18 0 1 1 0 36 18 18 0 0 1 0-36Zm0 4c-1.9 0-3.73.36-5.4 1.03 2.22 1.94 4.05 5.74 4.53 10.47h6.71a11.97 11.97 0 0 0-5.84-11.3ZM24 38c1.9 0 3.73-.36 5.4-1.03-2.22-1.94-4.05-5.74-4.53-10.47h-6.71A11.97 11.97 0 0 0 24 38Zm-8-12h-6.9a14 14 0 0 0 5.16 9.4c1.1-2.94 1.65-6.22 1.74-9.4Zm0-4c-.09-3.18-.64-6.46-1.74-9.4A14 14 0 0 0 9.1 22H16Zm16 4c.09 3.18.64 6.46 1.74 9.4A14 14 0 0 0 38.9 22H32Zm0-4h6.9a14 14 0 0 0-5.16-9.4c-1.1 2.94-1.65 6.22-1.74 9.4Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else-if="category.icon === 'pipeline'" viewBox="0 0 48 48" class="h-8 w-8">
                <path
                  d="M10 18a2 2 0 0 1 2-2h4V12a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2v-4h-4a2 2 0 0 1-2-2V18Zm8-4v4h12v-4H18Zm-6 6v10h4v-6h16v6h4V20H12Zm18 12H18v4h12v-4Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else viewBox="0 0 48 48" class="h-8 w-8">
                <path
                  d="M24 10a2 2 0 0 1 1.55.73l12 14a2 2 0 0 1-1.55 3.27H12a2 2 0 0 1-1.55-3.27l12-14A2 2 0 0 1 24 10Zm0 6.66-7.6 8.87h15.2L24 16.66ZM12 32h24a2 2 0 1 1 0 4H12a2 2 0 1 1 0-4Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div class="flex flex-col gap-1">
              <h3 class="text-lg font-semibold text-brand-dark">{{ category.name }}</h3>
              <p class="text-sm font-medium text-slate-500">{{ category.datasets }} Datasets</p>
            </div>
          </article>
        </div>
      </section>

      <section class="flex flex-col gap-6" aria-label="Featured datasets">
        <header class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="text-2xl font-semibold text-brand-dark sm:text-3xl">Featured Datasets</h2>
            <p class="mt-1 text-sm font-medium text-slate-500">{{ datasetCount }} curated data products</p>
          </div>

          <p class="max-w-xs text-sm text-slate-600">Select a dataset to explore rich metadata and records.</p>
        </header>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="dataset in availableDatasets"
            :key="dataset.id"
            class="group flex cursor-pointer flex-col gap-4 rounded-2xl border border-slate-300/40 bg-gradient-to-br from-slate-200/40 via-slate-100/80 to-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:-translate-y-1 focus-visible:shadow-xl focus-visible:ring-2 focus-visible:ring-brand-primary/50"
            role="button"
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

            <h3 class="text-lg font-semibold text-brand-dark">{{ dataset.title }}</h3>
            <p class="text-sm leading-relaxed text-slate-600">{{ dataset.summary }}</p>

            <ul class="flex flex-wrap gap-2" role="list">
              <li v-for="tag in dataset.tags" :key="tag" class="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
                {{ tag }}
              </li>
            </ul>

            <div
              v-if="datasetPreviews[dataset.id]?.rows?.length"
              class="mt-4 flex flex-col gap-3 rounded-xl border border-slate-300/40 bg-slate-200/40 p-3"
              role="region"
              :aria-label="`${dataset.title} sample data preview`"
            >
              <div class="max-w-full overflow-x-auto">
                <table class="min-w-[360px] table-auto border-collapse text-left text-xs text-slate-700">
                  <thead class="bg-slate-900/5 text-slate-900">
                    <tr>
                      <th
                        v-for="header in datasetPreviews[dataset.id].headers"
                        :key="header"
                        class="border-b border-slate-300/40 px-3 py-2 font-semibold"
                      >
                        {{ formatPreviewHeader(header) }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in datasetPreviews[dataset.id].rows" :key="rowIndex">
                      <td
                        v-for="header in datasetPreviews[dataset.id].headers"
                        :key="header"
                        class="border-b border-slate-300/20 px-3 py-2 text-slate-700"
                      >
                        {{ formatPreviewValue(row[header]) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="text-xs text-slate-500">Preview from {{ datasetPreviews[dataset.id].source }}</p>
            </div>

            <footer class="mt-auto flex flex-wrap items-end justify-between gap-3">
              <div class="flex flex-col gap-1">
                <span class="text-xl font-bold text-brand-dark">{{ dataset.heroStat }}</span>
                <span class="text-xs font-medium text-slate-500">{{ dataset.heroLabel }}</span>
              </div>

              <div class="inline-flex items-center gap-2 text-sm font-semibold text-sky-600">
                <span>View dataset</span>
                <svg viewBox="0 0 16 16" class="h-4 w-4" aria-hidden="true">
                  <path
                    d="M5.22 3.97a.75.75 0 0 1 1.06 0L10 7.69 6.28 11.4a.75.75 0 1 1-1.06-1.06l2.47-2.47-2.47-2.46a.75.75 0 0 1 0-1.06Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </footer>
          </article>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';
import { computed, ref } from 'vue';
import { datasetCategories as categories, datasets as availableDatasets } from '../data/datasets.js';
import { useRouter } from '../router/simpleRouter.js';

const filterOptions = ['Value', 'Date Added', 'Usage', 'Team'];
const labels = ['Value', 'Efficiency', 'Reliability', 'Costs', 'Sustainability'];
const selectedFilter = ref(filterOptions[0]);
const activeLabel = ref(labels[0]);

const datasetCount = availableDatasets.length;
const router = useRouter();

const datasetPreviews = computed(() => {
  const previews = {};

  availableDatasets.forEach((dataset) => {
    const sampleRecord = dataset.records?.find(
      (record) => Array.isArray(record?.sampleData) && record.sampleData.length,
    );

    if (!sampleRecord) {
      previews[dataset.id] = { headers: [], rows: [], source: null };
      return;
    }

    const rows = sampleRecord.sampleData.slice(0, 3).map((row) => row ?? {});
    const headers = [];
    rows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (!headers.includes(key)) {
          headers.push(key);
        }
      });
    });

    previews[dataset.id] = {
      headers,
      rows,
      source: sampleRecord.label ?? 'sample record',
    };
  });

  return previews;
});

const openCategory = (category) => {
  const categoryId = typeof category === 'string' ? category : category?.id;
  if (!categoryId) return;
  router.push(`/categories/${encodeURIComponent(categoryId)}`);
};

const openDataset = (id) => {
  router.push(`/datasets/${encodeURIComponent(id)}`);
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

const formatPreviewHeader = (key) => {
  if (!key) return '';
  return key
    .toString()
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

const formatPreviewValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-US').format(value);
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  return String(value);
};
</script>
