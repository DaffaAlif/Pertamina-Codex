<template>
  <main class="dataset-detail" aria-labelledby="dataset-detail-heading">
    <header class="dashboard__nav">
      <div class="dashboard__nav-inner">
        <div class="brand" aria-label="Pertamina Hulu Indonesia">
          <div class="logo" aria-hidden="true">
            <svg viewBox="0 0 120 32" role="presentation">
              <g fill="none" fill-rule="evenodd">
                <path
                  d="M17.8 0 8.9 9.52c-.97 1.03-.92 2.65.11 3.63l8.37 7.86c1.57 1.47 4.1.5 4.4-1.65l2.13-15.22C24.3 1.27 21.21-1.57 17.8 0z"
                  fill="#0098DA"
                />
                <path
                  d="M36.94 0 28.05 9.52c-.97 1.03-.92 2.65.11 3.63l8.37 7.86c1.57 1.47 4.1.5 4.4-1.65l2.13-15.22C43.44 1.27 40.35-1.57 36.94 0z"
                  fill="#ED1C24"
                />
                <path
                  d="M12.73 29.37c-2.47 0-3.92-2.76-2.53-4.84l12.67-18.89c1.88-2.8 6.14-1.76 6.14 1.59v17.94c0 2.31-1.87 4.2-4.2 4.2z"
                  fill="#00AA4F"
                />
              </g>
            </svg>
          </div>
          <span class="brand__name">Pertamina Hulu Indonesia</span>
        </div>

        <button type="button" class="profile-button">My Profile</button>
      </div>
    </header>

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
  </main>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
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

.dashboard__nav {
  padding: clamp(1.5rem, 3vw, 2.25rem) clamp(1.5rem, 4vw, 3rem);
  background: linear-gradient(120deg, #0f172a 0%, #1e293b 65%, #0f172a 100%);
  color: #ffffff;
}

.dashboard__nav-inner {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: clamp(64px, 12vw, 76px);
}

.logo svg {
  width: 100%;
  height: auto;
}

.brand__name {
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.profile-button {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  padding: 0.65rem 1.35rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.profile-button:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-1px);
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

.records__empty {
  margin: 0;
  padding: 1.5rem;
  background: rgba(148, 163, 184, 0.12);
  border-radius: 16px;
  color: #475569;
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
  .dashboard__nav {
    padding: 1.75rem 1.5rem;
  }

  .dataset-detail__content {
    padding: 2rem 1.75rem;
  }
}

@media (max-width: 640px) {
  .dashboard__nav {
    padding: 1.5rem 1.25rem;
  }

  .dataset-detail__content {
    padding: 1.75rem 1.25rem;
  }

  .dashboard__nav-inner {
    gap: 1rem;
  }
}
</style>
