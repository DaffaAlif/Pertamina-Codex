<template>
  <main class="dataset-detail" aria-labelledby="dataset-detail-heading">
    <AppHeader />

    <section v-if="dataset" class="dataset-detail__content">
      <div class="dataset-detail__intro">
        <button type="button" class="back-link" @click="goBack">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M9.78 3.97a.75.75 0 0 1 0 1.06L6.06 8.75l3.72 3.72a.75.75 0 1 1-1.06 1.06L4.47 9.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" fill="currentColor" />
          </svg>
          <span>Back to Discover</span>
        </button>

        <p class="eyebrow">Dataset</p>
        <h1 id="dataset-detail-heading">{{ dataset.title }}</h1>
        <p class="dataset-detail__summary">{{ dataset.summary }}</p>

        <div class="dataset-detail__meta" role="list">
          <span role="listitem"><strong>Domain:</strong> {{ dataset.domain }}</span>
          <span role="listitem"><strong>Owner:</strong> {{ dataset.owner }}</span>
          <span role="listitem"><strong>Zona:</strong> {{ dataset.zone }}</span>
          <span role="listitem"><strong>Regional:</strong> {{ dataset.region }}</span>
          <span role="listitem"><strong>Updated:</strong> {{ formatDate(dataset.lastUpdated) }}</span>
        </div>

        <div class="dataset-detail__chips" role="list">
          <span v-for="tag in dataset.tags" :key="tag" role="listitem">{{ tag }}</span>
        </div>

        <div class="dataset-detail__hero" role="presentation">
          <span class="dataset-detail__hero-value">{{ dataset.heroStat }}</span>
          <span class="dataset-detail__hero-label">{{ dataset.heroLabel }}</span>
        </div>
      </div>

      <div class="dataset-detail__layout">
        <aside class="dataset-detail__filters" aria-label="Filter dataset records">
          <div class="filters-panel__header">
            <h2>Filter Records</h2>
            <button
              v-if="hasActiveFilters"
              type="button"
              class="filters-panel__clear"
              @click="clearFilters"
            >
              Clear all
            </button>
          </div>

          <div class="filters-panel__controls">
            <label v-for="config in filterConfig" :key="config.key" class="filters-panel__control">
              <span>{{ config.label }}</span>
              <select v-model="filters[config.key]">
                <option v-for="option in filterOptions[config.key]" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>
          </div>
        </aside>

        <div class="dataset-detail__records" aria-live="polite">
          <header class="records__header">
            <div>
              <h2>{{ recordCountLabel }}</h2>
              <p>{{ hasActiveFilters ? 'Filters applied' : 'Showing all available records' }}</p>
            </div>
          </header>

          <div v-if="filteredRecords.length" class="records__list">
            <article v-for="record in filteredRecords" :key="record.id" class="record-card">
              <header class="record-card__header">
                <div class="record-card__heading">
                  <h3>{{ record.label }}</h3>
                  <p class="record-card__id">{{ record.id }}</p>
                </div>
                <span class="record-card__status" :data-status="record.status">{{ record.status }}</span>
              </header>

              <p class="record-card__description">{{ record.description }}</p>

              <dl class="record-card__meta">
                <div>
                  <dt>Date</dt>
                  <dd>{{ formatDate(record.date) }}</dd>
                </div>
                <div>
                  <dt>Owner</dt>
                  <dd>{{ record.owner }}</dd>
                </div>
                <div>
                  <dt>Data Type</dt>
                  <dd>{{ record.dataType }}</dd>
                </div>
                <div>
                  <dt>Zona</dt>
                  <dd>{{ record.zone }}</dd>
                </div>
                <div>
                  <dt>Regional</dt>
                  <dd>{{ record.region }}</dd>
                </div>
              </dl>

              <ul v-if="record.highlights?.length" class="record-card__highlights" role="list">
                <li v-for="highlight in record.highlights" :key="highlight" role="listitem">
                  {{ highlight }}
                </li>
              </ul>

              <footer v-if="record.sampleData?.length" class="record-card__actions">
                <button type="button" class="record-card__download" @click="openRequestModal(record)">
                  Download sample CSV
                </button>
              </footer>
            </article>
          </div>

          <p v-else class="records__empty">No records match the selected filters. Try broadening your selections.</p>
        </div>
      </div>
    </section>

    <section v-else class="dataset-detail__empty">
      <div class="empty-card">
        <h1>Dataset not found</h1>
        <p>The dataset you are looking for is not available. Return to the dashboard to browse the catalog.</p>
        <button type="button" class="back-link back-link--emphasis" @click="goBack">Back to Discover</button>
      </div>
    </section>

    <div
      v-if="isRequestModalOpen"
      class="request-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-form-title"
    >
      <div class="request-modal__overlay" @click="closeRequestModal" aria-hidden="true"></div>
      <div
        class="request-modal__dialog"
        role="document"
        tabindex="-1"
        ref="requestModalDialog"
        @keydown.esc.prevent="closeRequestModal"
      >
        <header class="request-modal__header">
          <h2 id="request-form-title">Request Form</h2>
          <button type="button" class="request-modal__close" @click="closeRequestModal" aria-label="Close request form">
            ×
          </button>
        </header>

        <section class="request-modal__summary" aria-live="polite">
          <h3>{{ dataset?.title }}</h3>
          <p v-if="selectedRecordInfo">
            Data Type: {{ selectedRecordInfo.dataType }}, row: {{ selectedRecordInfo.rows }}, column:
            {{ selectedRecordInfo.columns }}
          </p>
        </section>

        <form class="request-modal__form" @submit.prevent="submitRequestForm">
          <label class="request-modal__field">
            <span>Project</span>
            <input
              v-model="requestForm.project"
              type="text"
              name="project"
              required
              placeholder="Enter project name"
              ref="projectInput"
            />
            <span v-if="formErrors.project" class="request-modal__error">{{ formErrors.project }}</span>
          </label>

          <label class="request-modal__field">
            <span>Alasan Request</span>
            <textarea
              v-model="requestForm.reason"
              name="reason"
              rows="3"
              required
              placeholder="Describe your reason for requesting this data"
            ></textarea>
            <span v-if="formErrors.reason" class="request-modal__error">{{ formErrors.reason }}</span>
          </label>

          <footer class="request-modal__actions">
            <button type="button" class="request-modal__button request-modal__button--secondary" @click="closeRequestModal">
              Cancel
            </button>
            <button type="submit" class="request-modal__button request-modal__button--primary">Request</button>
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
];

const createDefaultFilterState = () => ({
  dataType: 'All',
  owner: 'All',
  zone: 'All',
  region: 'All',
});

const filters = reactive(createDefaultFilterState());

watch(
  () => props.datasetId,
  () => {
    Object.assign(filters, createDefaultFilterState());
  },
  { immediate: true }
);

const filterOptions = computed(() => {
  const options = {};
  const records = dataset.value?.records ?? [];

  filterConfig.forEach((config) => {
    const values = Array.from(
      new Set(
        records
          .map((record) => record[config.key])
          .filter((value) => value !== undefined && value !== null && value !== '')
      )
    ).sort((a, b) => String(a).localeCompare(String(b)));

    options[config.key] = ['All', ...values];
  });

  return options;
});

const filteredRecords = computed(() => {
  if (!dataset.value) {
    return [];
  }

  return dataset.value.records.filter((record) =>
    filterConfig.every((config) => {
      const selected = filters[config.key];
      if (!selected || selected === 'All') {
        return true;
      }

      return record[config.key] === selected;
    })
  );
});

const recordCountLabel = computed(() => {
  const count = filteredRecords.value.length;
  const label = count === 1 ? 'Record' : 'Records';
  return `${count} ${label}`;
});

const hasActiveFilters = computed(() => filterConfig.some((config) => filters[config.key] !== 'All'));

const clearFilters = () => {
  Object.assign(filters, createDefaultFilterState());
};

const goBack = () => {
  router.push('/');
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
const requestModalDialog = ref(null);
const projectInput = ref(null);

const selectedRecordInfo = computed(() => {
  if (!selectedRecord.value) {
    return null;
  }

  const sampleRows = selectedRecord.value.sampleData ?? [];
  const columnKeys = new Set();
  sampleRows.forEach((row) => {
    Object.keys(row ?? {}).forEach((key) => columnKeys.add(key));
  });

  return {
    dataType: selectedRecord.value.dataType ?? dataset.value?.dataType ?? '—',
    rows: sampleRows.length,
    columns: columnKeys.size,
  };
});

const resetRequestForm = () => {
  requestForm.project = '';
  requestForm.reason = '';
  formErrors.project = '';
  formErrors.reason = '';
};

const openRequestModal = (record) => {
  selectedRecord.value = record;
  resetRequestForm();
  isRequestModalOpen.value = true;
};

const closeRequestModal = () => {
  isRequestModalOpen.value = false;
  selectedRecord.value = null;
  resetRequestForm();
};

watch(isRequestModalOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      requestModalDialog.value?.focus();
      projectInput.value?.focus();
    });
  }
});

const validateRequestForm = () => {
  let valid = true;

  if (!requestForm.project.trim()) {
    formErrors.project = 'Project is required';
    valid = false;
  } else {
    formErrors.project = '';
  }

  if (!requestForm.reason.trim()) {
    formErrors.reason = 'Alasan Request is required';
    valid = false;
  } else {
    formErrors.reason = '';
  }

  return valid;
};

const submitRequestForm = () => {
  if (!selectedRecord.value) {
    return;
  }

  if (!validateRequestForm()) {
    return;
  }

  downloadCsv(selectedRecord.value);
  closeRequestModal();
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

<style scoped>
.dataset-detail {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(226, 232, 240, 0.4) 0%, rgba(248, 250, 252, 0.85) 40%, #ffffff 100%);
  color: #0f172a;
}

.dataset-detail__content {
  flex: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(1.75rem, 3vw, 2.75rem) clamp(1.5rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.dataset-detail__intro {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #0ea5e9;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.back-link svg {
  width: 1rem;
  height: 1rem;
}

.back-link--emphasis {
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  background: #0ea5e9;
  color: #ffffff;
  border: none;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.4em;
  margin: 0;
  color: #94a3b8;
  font-weight: 600;
}

h1 {
  margin: 0;
  font-size: clamp(1.9rem, 3.2vw, 2.6rem);
  color: #0f172a;
}

.dataset-detail__summary {
  margin: 0;
  color: #475569;
  line-height: 1.6;
  font-size: 1.05rem;
}

.dataset-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  color: #475569;
  font-size: 0.95rem;
}

.dataset-detail__meta strong {
  color: #0f172a;
}

.dataset-detail__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dataset-detail__chips span {
  background: rgba(14, 165, 233, 0.12);
  color: #0284c7;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.dataset-detail__hero {
  display: inline-flex;
  align-items: baseline;
  gap: 0.75rem;
  background: rgba(14, 165, 233, 0.1);
  color: #0f172a;
  padding: 0.75rem 1.2rem;
  border-radius: 14px;
  width: fit-content;
}

.dataset-detail__hero-value {
  font-size: 1.6rem;
  font-weight: 700;
}

.dataset-detail__hero-label {
  font-size: 0.95rem;
  color: #0f172a;
  opacity: 0.8;
}

.dataset-detail__layout {
  display: grid;
  grid-template-columns: minmax(220px, 260px) 1fr;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: start;
}

.dataset-detail__filters {
  background: linear-gradient(150deg, rgba(226, 232, 240, 0.45) 0%, rgba(241, 245, 249, 0.85) 60%, #ffffff 100%);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.filters-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.filters-panel__header h2 {
  margin: 0;
  font-size: 1.1rem;
}

.filters-panel__clear {
  background: none;
  border: none;
  color: #0ea5e9;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.filters-panel__controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filters-panel__control {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.95rem;
  color: #1e293b;
}

.filters-panel__control select {
  appearance: none;
  border: 1px solid rgba(148, 163, 184, 0.5);
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  background: #ffffff;
}

.dataset-detail__records {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.records__header h2 {
  margin: 0;
  font-size: 1.35rem;
}

.records__header p {
  margin: 0.35rem 0 0;
  color: #64748b;
  font-weight: 500;
}

.records__list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.record-card {
  background: linear-gradient(150deg, rgba(248, 250, 252, 0.92) 0%, rgba(255, 255, 255, 0.9) 60%, #ffffff 100%);
  border-radius: 18px;
  padding: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.record-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.record-card__heading h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #0f172a;
}

.record-card__id {
  margin: 0.35rem 0 0;
  color: #64748b;
  font-size: 0.85rem;
}

.record-card__status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(14, 165, 233, 0.15);
  color: #0369a1;
}

.record-card__status[data-status='Published'],
.record-card__status[data-status='Completed'] {
  background: rgba(34, 197, 94, 0.18);
  color: #15803d;
}

.record-card__status[data-status='Active'] {
  background: rgba(59, 130, 246, 0.18);
  color: #1d4ed8;
}

.record-card__status[data-status='Draft'] {
  background: rgba(251, 191, 36, 0.22);
  color: #b45309;
}

.record-card__description {
  margin: 0;
  color: #475569;
  line-height: 1.55;
}

.record-card__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem 1.25rem;
  margin: 0;
}

.record-card__meta div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.record-card__meta dt {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
  margin: 0;
}

.record-card__meta dd {
  margin: 0;
  color: #0f172a;
  font-weight: 600;
}

.record-card__highlights {
  margin: 0;
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: #334155;
  font-size: 0.95rem;
}

.record-card__actions {
  margin-top: 1.25rem;
}

.record-card__download {
  background: #0ea5e9;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.record-card__download:hover,
.record-card__download:focus-visible {
  background: #0284c7;
  outline: none;
}

.records__empty {
  margin: 0;
  padding: 1.5rem;
  background: rgba(148, 163, 184, 0.12);
  border-radius: 16px;
  color: #475569;
}

.request-modal {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.request-modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(6px);
}

.request-modal__dialog {
  position: relative;
  width: min(520px, 100%);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.96) 0%, #f8fafc 100%);
  border-radius: 22px;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.18);
  padding: 2.25rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  z-index: 1;
  max-height: min(92vh, 560px);
  overflow-y: auto;
}

.request-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.request-modal__header h2 {
  margin: 0;
  font-size: 1.35rem;
  color: #0f172a;
}

.request-modal__close {
  appearance: none;
  border: none;
  background: rgba(148, 163, 184, 0.18);
  color: #0f172a;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease;
}

.request-modal__close:hover,
.request-modal__close:focus-visible {
  background: rgba(14, 165, 233, 0.18);
}

.request-modal__summary h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #0f172a;
}

.request-modal__summary p {
  margin: 0.4rem 0 0;
  color: #475569;
  font-size: 0.95rem;
}

.request-modal__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.request-modal__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #1f2937;
}

.request-modal__field input,
.request-modal__field textarea {
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 12px;
  padding: 0.75rem 0.9rem;
  font-size: 0.95rem;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.request-modal__field input:focus-visible,
.request-modal__field textarea:focus-visible {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.18);
}

.request-modal__error {
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 600;
}

.request-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.request-modal__button {
  border: none;
  border-radius: 999px;
  padding: 0.65rem 1.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 0.85rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.request-modal__button--secondary {
  background: rgba(148, 163, 184, 0.2);
  color: #1e293b;
}

.request-modal__button--primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(2, 132, 199, 0.25);
}

.request-modal__button--secondary:hover,
.request-modal__button--secondary:focus-visible {
  background: rgba(148, 163, 184, 0.3);
}

.request-modal__button--primary:hover,
.request-modal__button--primary:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 16px 32px rgba(2, 132, 199, 0.35);
}

.dataset-detail__empty {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 3rem 1.5rem;
}

.empty-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  max-width: 420px;
  text-align: center;
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-card h1 {
  margin: 0;
  font-size: 1.6rem;
}

.empty-card p {
  margin: 0;
  color: #475569;
}

@media (max-width: 960px) {
  .dataset-detail__layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dataset-detail__content {
    padding: 2rem 1.75rem;
  }
}

@media (max-width: 640px) {
  .dataset-detail__content {
    padding: 1.75rem 1.25rem;
  }
}
</style>
