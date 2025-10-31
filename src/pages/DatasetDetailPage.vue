<template>
  <main class="flex min-h-screen w-full flex-col">
    <AppHeader />

    <section v-if="dataset" class="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-10">
      <div class="flex flex-col gap-8">
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

          <p class="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Dataset</p>
          <h1 id="dataset-detail-heading" class="mt-2 text-3xl font-semibold text-brand-dark sm:text-4xl">
            {{ dataset.title }}
          </h1>
          <p class="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{{ dataset.summary }}</p>

          <div class="mt-6 flex flex-wrap gap-3 text-sm text-slate-600" role="list">
            <span role="listitem" class="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-3 py-1">
              <strong class="font-semibold text-brand-dark">Domain:</strong> {{ dataset.domain }}
            </span>
            <span role="listitem" class="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-3 py-1">
              <strong class="font-semibold text-brand-dark">Owner:</strong> {{ dataset.owner }}
            </span>
            <span role="listitem" class="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-3 py-1">
              <strong class="font-semibold text-brand-dark">Zona:</strong> {{ dataset.zone }}
            </span>
            <span role="listitem" class="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-3 py-1">
              <strong class="font-semibold text-brand-dark">Regional:</strong> {{ dataset.region }}
            </span>
            <span role="listitem" class="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-3 py-1">
              <strong class="font-semibold text-brand-dark">Updated:</strong> {{ formatDate(dataset.lastUpdated) }}
            </span>
          </div>

          <div class="mt-4 flex flex-wrap gap-2" role="list">
            <span
              v-for="tag in dataset.tags"
              :key="tag"
              role="listitem"
              class="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-primary"
            >
              {{ tag }}
            </span>
          </div>

          <div class="mt-6 inline-flex flex-col items-start gap-1 rounded-2xl bg-brand-primary/10 px-6 py-4">
            <span class="text-3xl font-bold text-brand-dark">{{ dataset.heroStat }}</span>
            <span class="text-sm font-medium text-slate-600">{{ dataset.heroLabel }}</span>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr]">
          <aside
            class="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-lg shadow-brand-dark/10 backdrop-blur"
            aria-label="Filter dataset records"
          >
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold text-brand-dark">Filter Records</h2>
              <button
                v-if="hasActiveFilters"
                type="button"
                class="text-sm font-semibold text-slate-500 underline-offset-4 transition hover:text-brand-primary"
                @click="clearFilters"
              >
                Clear all
              </button>
            </div>

            <div class="mt-6 space-y-4">
              <label
                v-for="config in filterConfig"
                :key="config.key"
                class="flex flex-col gap-2 text-sm font-medium text-slate-700"
              >
                <span>{{ config.label }}</span>
                <select
                  v-model="filters[config.key]"
                  class="rounded-xl border border-slate-300/80 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
                >
                  <option v-for="option in filterOptions[config.key]" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>
            </div>
          </aside>

          <div class="flex flex-col gap-6" aria-live="polite">
            <header class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-semibold text-brand-dark">{{ recordCountLabel }}</h2>
                <p class="text-sm text-slate-500">
                  {{ hasActiveFilters ? 'Filters applied' : 'Showing all available records' }}
                </p>
              </div>
            </header>

            <div v-if="filteredRecords.length" class="space-y-6">
              <article
                v-for="record in filteredRecords"
                :key="record.id"
                class="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-lg shadow-brand-dark/10 backdrop-blur transition"
              >
                <header class="flex flex-wrap items-start justify-between gap-4">
                  <div class="flex flex-col gap-1">
                    <h3 class="text-xl font-semibold text-brand-dark">{{ record.label }}</h3>
                    <p class="text-xs font-medium text-slate-500">{{ record.id }}</p>
                  </div>
                  <span :class="['inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize', statusClass(record.status)]">
                    {{ record.status }}
                  </span>
                </header>

                <p class="mt-4 text-sm leading-relaxed text-slate-600">{{ record.description }}</p>

                <dl class="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-600 sm:grid-cols-3 lg:grid-cols-5">
                  <div class="flex flex-col gap-1">
                    <dt class="font-semibold text-brand-dark">Date</dt>
                    <dd>{{ formatDate(record.date) }}</dd>
                  </div>
                  <div class="flex flex-col gap-1">
                    <dt class="font-semibold text-brand-dark">Owner</dt>
                    <dd>{{ record.owner }}</dd>
                  </div>
                  <div class="flex flex-col gap-1">
                    <dt class="font-semibold text-brand-dark">Data Type</dt>
                    <dd>{{ record.dataType }}</dd>
                  </div>
                  <div class="flex flex-col gap-1">
                    <dt class="font-semibold text-brand-dark">Zona</dt>
                    <dd>{{ record.zone }}</dd>
                  </div>
                  <div class="flex flex-col gap-1">
                    <dt class="font-semibold text-brand-dark">Regional</dt>
                    <dd>{{ record.region }}</dd>
                  </div>
                </dl>

                <ul v-if="record.highlights?.length" class="mt-4 flex flex-wrap gap-2" role="list">
                  <li
                    v-for="highlight in record.highlights"
                    :key="highlight"
                    role="listitem"
                    class="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {{ highlight }}
                  </li>
                </ul>

                <footer v-if="record.sampleData?.length" class="mt-6">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-xl border border-brand-primary/60 bg-brand-primary/10 px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                    @click="openRequestModal(record)"
                  >
                    Download sample CSV
                  </button>
                </footer>
              </article>
            </div>

            <p v-else class="rounded-3xl border border-dashed border-slate-300/70 bg-white/80 p-6 text-center text-sm text-slate-500">
              No records match the selected filters. Try broadening your selections.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-6 py-16 text-center">
      <div class="rounded-3xl border border-slate-200/70 bg-white/95 p-10 shadow-xl shadow-brand-dark/10 backdrop-blur">
        <h1 class="text-3xl font-semibold text-brand-dark">Dataset not found</h1>
        <p class="mt-3 text-sm text-slate-600">
          The dataset you are looking for is not available. Return to the dashboard to browse the catalog.
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

    <div
      v-if="isRequestModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-form-title"
    >
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeRequestModal" aria-hidden="true"></div>
      <div
        class="relative w-full max-w-xl rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-2xl shadow-brand-dark/20 backdrop-blur"
        role="document"
        tabindex="-1"
        ref="requestModalDialog"
        @keydown.esc.prevent="closeRequestModal"
      >
        <header class="flex items-center justify-between gap-4">
          <h2 id="request-form-title" class="text-xl font-semibold text-brand-dark">Request Form</h2>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/5 text-lg font-semibold text-slate-600 transition hover:bg-slate-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            @click="closeRequestModal"
            aria-label="Close request form"
          >
            ×
          </button>
        </header>

        <section class="mt-4 space-y-2" aria-live="polite">
          <h3 class="text-lg font-semibold text-brand-dark">{{ dataset?.title }}</h3>
          <p v-if="selectedRecordInfo" class="text-sm text-slate-600">
            Data Type: {{ selectedRecordInfo.dataType }}, row: {{ selectedRecordInfo.rows }}, column: {{ selectedRecordInfo.columns }}
          </p>
        </section>

        <form class="mt-6 flex flex-col gap-5" @submit.prevent="submitRequestForm">
          <label class="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Project</span>
            <input
              v-model="requestForm.project"
              type="text"
              name="project"
              required
              placeholder="Enter project name"
              ref="projectInput"
              class="rounded-xl border border-slate-300/80 px-4 py-3 text-base font-medium text-slate-800 shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
            />
            <span v-if="formErrors.project" class="text-xs font-medium text-red-600">{{ formErrors.project }}</span>
          </label>

          <label class="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Alasan Request</span>
            <textarea
              v-model="requestForm.reason"
              name="reason"
              rows="3"
              required
              placeholder="Describe your reason for requesting this data"
              class="rounded-xl border border-slate-300/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
            ></textarea>
            <span v-if="formErrors.reason" class="text-xs font-medium text-red-600">{{ formErrors.reason }}</span>
          </label>

          <footer class="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-300/80 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              @click="closeRequestModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              Request
            </button>
          </footer>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { datasets } from '../data/datasets.js';
import { useRouter } from '../router/simpleRouter.js';

const props = defineProps({
  datasetId: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const dataset = computed(() => datasets.find((entry) => entry.id === props.datasetId));

const filterConfig = [
  { key: 'dataType', label: 'Data Type' },
  { key: 'owner', label: 'Owner' },
  { key: 'zone', label: 'Zona' },
  { key: 'region', label: 'Regional' },
  { key: 'status', label: 'Status' },
];

const createDefaultFilterState = () => ({
  dataType: 'All',
  owner: 'All',
  zone: 'All',
  region: 'All',
  status: 'All',
});

const filters = reactive(createDefaultFilterState());

watch(
  () => props.datasetId,
  () => {
    Object.assign(filters, createDefaultFilterState());
  },
  { immediate: true },
);

const filterOptions = computed(() => {
  const options = {};
  const records = dataset.value?.records ?? [];

  filterConfig.forEach((config) => {
    const values = Array.from(
      new Set(
        records
          .map((record) => record[config.key])
          .filter((value) => value !== undefined && value !== null && value !== ''),
      ),
    ).sort((a, b) => String(a).localeCompare(String(b)));

    options[config.key] = ['All', ...values];
  });

  return options;
});

const hasActiveFilters = computed(() => filterConfig.some((config) => filters[config.key] !== 'All'));

const filteredRecords = computed(() => {
  if (!dataset.value?.records) {
    return [];
  }

  return dataset.value.records.filter((record) =>
    filterConfig.every((config) => {
      const selected = filters[config.key];
      if (!selected || selected === 'All') {
        return true;
      }

      return record[config.key] === selected;
    }),
  );
});

const recordCountLabel = computed(() => {
  const count = filteredRecords.value.length;
  const label = count === 1 ? 'record' : 'records';
  return `${count} ${label}`;
});

const clearFilters = () => {
  Object.assign(filters, createDefaultFilterState());
};

const goBack = () => {
  router.push('/');
};

const isRequestModalOpen = ref(false);
const selectedRecord = ref(null);

const requestForm = reactive({
  project: '',
  reason: '',
});

const formErrors = reactive({
  project: '',
  reason: '',
});

const projectInput = ref(null);
const requestModalDialog = ref(null);

const selectedRecordInfo = computed(() => {
  if (!selectedRecord.value) {
    return null;
  }

  const record = selectedRecord.value;
  const sample = Array.isArray(record.sampleData) && record.sampleData.length ? record.sampleData[0] : null;

  return {
    dataType: record.dataType,
    rows: sample?.rows ?? record.rows ?? '—',
    columns: sample?.columns ?? record.columns ?? '—',
  };
});

const statusClass = (status) => {
  const normalized = status?.toString().toLowerCase() ?? '';
  if (['published', 'completed', 'approved', 'passed'].includes(normalized)) {
    return 'bg-emerald-100 text-emerald-700';
  }
  if (['active', 'uploaded'].includes(normalized)) {
    return 'bg-sky-100 text-sky-700';
  }
  if (['draft', 'pending signature', 'warning'].includes(normalized)) {
    return 'bg-amber-100 text-amber-700';
  }
  return 'bg-slate-200 text-slate-700';
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  let stringValue;
  if (typeof value === 'string') {
    stringValue = value;
  } else if (typeof value === 'number' || typeof value === 'bigint') {
    stringValue = String(value);
  } else if (typeof value === 'boolean') {
    stringValue = value ? 'true' : 'false';
  } else {
    stringValue = JSON.stringify(value);
  }

  const escaped = stringValue.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
};

const createCsv = (rows = []) => {
  if (!rows.length) {
    return '';
  }

  const headers = [...Object.keys(rows[0])];
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (!headers.includes(key)) {
        headers.push(key);
      }
    });
  });

  const csvRows = [headers.map((header) => escapeCsvValue(header)).join(',')];

  rows.forEach((row) => {
    const values = headers.map((header) => escapeCsvValue(row[header]));
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
};

const downloadCsv = (record) => {
  const rows = record?.sampleData ?? [];
  if (!rows.length) {
    return;
  }

  const csvContent = createCsv(rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${record.id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const openRequestModal = (record) => {
  selectedRecord.value = record;
  isRequestModalOpen.value = true;
  requestForm.project = '';
  requestForm.reason = '';
  formErrors.project = '';
  formErrors.reason = '';

  nextTick(() => {
    if (projectInput.value) {
      projectInput.value.focus();
    }
  });
};

const closeRequestModal = () => {
  isRequestModalOpen.value = false;
  selectedRecord.value = null;
  requestForm.project = '';
  requestForm.reason = '';
  formErrors.project = '';
  formErrors.reason = '';
};

const validateRequestForm = () => {
  formErrors.project = requestForm.project ? '' : 'Project name is required.';
  formErrors.reason = requestForm.reason ? '' : 'Please describe your reason.';
  return !formErrors.project && !formErrors.reason;
};

const submitRequestForm = () => {
  if (!selectedRecord.value || !validateRequestForm()) {
    return;
  }

  downloadCsv(selectedRecord.value);
  closeRequestModal();
};

watch(isRequestModalOpen, (open) => {
  if (open) {
    nextTick(() => {
      requestModalDialog.value?.focus();
    });
  }
});
</script>
