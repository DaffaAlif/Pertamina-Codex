<template>
  <main class="dataset-details" aria-labelledby="dataset-details-heading">
    <AppHeader />

    <section v-if="dataset" class="dataset-details__content">
      <header class="dataset-details__hero">
        <button type="button" class="back-link" @click="goBack">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M9.78 3.97a.75.75 0 0 1 0 1.06L6.06 8.75l3.72 3.72a.75.75 0 1 1-1.06 1.06L4.47 9.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              fill="currentColor"
            />
          </svg>
          <span>{{ backLinkLabel }}</span>
        </button>

        <p class="dataset-details__eyebrow">Dataset</p>
        <h1 id="dataset-details-heading">{{ dataset.title }}</h1>
        <p class="dataset-details__summary">{{ dataset.summary }}</p>

        <section class="dataset-details__meta" aria-label="Dataset metadata">
          <article v-if="dataset.heroStat" class="dataset-details__hero-stat">
            <p class="dataset-details__hero-stat-value">{{ dataset.heroStat }}</p>
            <p class="dataset-details__hero-stat-label">{{ dataset.heroLabel }}</p>
          </article>

          <dl class="dataset-details__meta-grid">
            <div v-for="item in metadata" :key="item.label">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
        </section>

        <ul v-if="tags.length" class="dataset-details__tags" role="list">
          <li v-for="tag in tags" :key="tag" role="listitem">{{ tag }}</li>
        </ul>
      </header>

      <section class="dataset-details__records" aria-labelledby="records-heading">
        <div class="dataset-details__records-header">
          <div>
            <p class="dataset-details__eyebrow">Records</p>
            <h2 id="records-heading">Available files & outputs</h2>
            <p class="dataset-details__records-description">
              Explore curated extracts, reports, and live feeds aligned to this dataset. Each card highlights ownership, freshness,
              and key takeaways to help you assess relevance.
            </p>
          </div>

          <div class="dataset-details__actions">
            <button type="button" class="request-button" @click="requestAccess">Request Access</button>
          </div>
        </div>

        <div v-if="previewRecords.length" class="dataset-details__record-grid" role="list">
          <article
            v-for="record in previewRecords"
            :key="record.id"
            class="record-card"
            role="listitem"
            :aria-labelledby="`record-${record.id}-title`"
          >
            <header class="record-card__header">
              <div class="record-card__titles">
                <p :id="`record-${record.id}-title`" class="record-card__title">{{ record.label }}</p>
                <p v-if="record.description" class="record-card__description">{{ record.description }}</p>
              </div>
              <span class="record-card__status" :data-status="normalizeStatus(record.status)">
                {{ record.status || 'Unknown status' }}
              </span>
            </header>

            <dl class="record-card__meta">
              <div>
                <dt>Last updated</dt>
                <dd>{{ formatDateLong(record.date) }}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{{ record.owner || dataset.owner }}</dd>
              </div>
              <div>
                <dt>Data type</dt>
                <dd>{{ record.dataType || dataset.dataType }}</dd>
              </div>
              <div>
                <dt>Zone</dt>
                <dd>{{ record.zone || dataset.zone || '—' }}</dd>
              </div>
              <div>
                <dt>Region</dt>
                <dd>{{ record.region || dataset.region || '—' }}</dd>
              </div>
            </dl>

            <ul v-if="record.highlights?.length" class="record-card__highlights" role="list">
              <li v-for="highlight in record.highlights" :key="highlight" role="listitem">
                {{ highlight }}
              </li>
            </ul>
          </article>
        </div>

        <p v-else class="dataset-details__empty">No supporting records are available for this dataset yet.</p>
      </section>
    </section>

    <section v-else class="dataset-details__empty-state">
      <div class="empty-card">
        <h1>Dataset not found</h1>
        <p>The dataset you are looking for is not available. Return to the dashboard to browse the catalog.</p>
        <button type="button" class="back-link back-link--emphasis" @click="goBack">Back to Discover</button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import AppHeader from '../components/AppHeader.vue';
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

const tags = computed(() => dataset.value?.tags ?? []);

const metadata = computed(() => {
  if (!dataset.value) return [];
  return [
    { label: 'Domain', value: dataset.value.domain || '—' },
    { label: 'Owner', value: dataset.value.owner || '—' },
    { label: 'Data Type', value: dataset.value.dataType || '—' },
    { label: 'Zone', value: dataset.value.zone || '—' },
    { label: 'Region', value: dataset.value.region || '—' },
    { label: 'Last Updated', value: formatDateLong(dataset.value.lastUpdated) },
  ];
});

const previewRecords = computed(() => dataset.value?.records ?? []);

const backLinkLabel = computed(() => (dataset.value?.categoryId ? 'Back to Category' : 'Back to Discover'));

const goBack = () => {
  const categoryId = dataset.value?.categoryId;
  if (categoryId) {
    router.push(`/categories/${encodeURIComponent(categoryId)}`);
    return;
  }
  router.push('/');
};

const requestAccess = () => {
  if (typeof window !== 'undefined') {
    window.alert(`Request submitted for ${dataset.value?.title ?? 'this dataset'}.`);
  }
};

const normalizeStatus = (status) => {
  if (!status) return 'unknown';
  return status.toLowerCase().replace(/\s+/g, '-');
};

const formatDateLong = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<style scoped>
.dataset-details {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(226, 232, 240, 0.4) 0%, rgba(248, 250, 252, 0.85) 40%, #ffffff 100%);
  color: #0f172a;
}

.dataset-details__content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1.75rem, 3vw, 2.75rem) clamp(1.5rem, 4vw, 3rem) 4rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.dataset-details__hero {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: linear-gradient(135deg, rgba(226, 232, 240, 0.45) 0%, rgba(241, 245, 249, 0.75) 55%, #ffffff 100%);
  border-radius: 32px;
  padding: clamp(1.75rem, 3vw, 3rem);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.08);
}

.dataset-details__eyebrow {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.4em;
  margin: 0;
  color: #94a3b8;
  font-weight: 600;
}

.dataset-details__summary {
  margin: 0;
  color: #475569;
  line-height: 1.6;
  font-size: 1.05rem;
}

.dataset-details__meta {
  display: grid;
  gap: clamp(1.5rem, 2.5vw, 2rem);
}

.dataset-details__hero-stat {
  background: radial-gradient(circle at top, rgba(14, 165, 233, 0.25), rgba(14, 165, 233, 0));
  border: 1px solid rgba(14, 165, 233, 0.35);
  border-radius: 24px;
  padding: clamp(1.5rem, 2.5vw, 2rem);
  display: inline-flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 320px;
}

.dataset-details__hero-stat-value {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 700;
  color: #0ea5e9;
}

.dataset-details__hero-stat-label {
  margin: 0;
  color: #0f172a;
  font-weight: 600;
  font-size: 0.95rem;
}

.dataset-details__meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.25rem;
}

.dataset-details__meta-grid div {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.dataset-details__meta-grid dt {
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
}

.dataset-details__meta-grid dd {
  margin: 0;
  font-weight: 600;
  color: #0f172a;
  font-size: 1rem;
}

.dataset-details__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.dataset-details__tags li {
  background: rgba(14, 165, 233, 0.12);
  color: #0284c7;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.dataset-details__records {
  background: #ffffff;
  border-radius: 32px;
  padding: clamp(1.75rem, 3vw, 3rem);
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dataset-details__records-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dataset-details__records h2 {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}

.dataset-details__records-description {
  margin: 0;
  color: #64748b;
  max-width: 560px;
  line-height: 1.6;
}

.dataset-details__actions {
  display: flex;
  justify-content: flex-end;
}

.request-button {
  background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 0.85rem 2.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.request-button:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.45);
  outline-offset: 4px;
}

.request-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 32px rgba(37, 99, 235, 0.35);
}

.dataset-details__record-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.record-card {
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.7), #ffffff 70%);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.record-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.record-card__titles {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.record-card__title {
  margin: 0;
  font-weight: 600;
  font-size: 1.05rem;
  color: #0f172a;
}

.record-card__description {
  margin: 0;
  color: #475569;
  line-height: 1.5;
  font-size: 0.95rem;
}

.record-card__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #0f172a;
  background: rgba(148, 163, 184, 0.25);
}

.record-card__status[data-status='published'] {
  background: rgba(34, 197, 94, 0.18);
  color: #15803d;
}

.record-card__status[data-status='active'] {
  background: rgba(14, 165, 233, 0.18);
  color: #0369a1;
}

.record-card__status[data-status='completed'] {
  background: rgba(99, 102, 241, 0.18);
  color: #3730a3;
}

.record-card__status[data-status='draft'] {
  background: rgba(248, 113, 113, 0.18);
  color: #b91c1c;
}

.record-card__meta {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.record-card__meta div {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.record-card__meta dt {
  margin: 0;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
}

.record-card__meta dd {
  margin: 0;
  font-weight: 600;
  color: #0f172a;
}

.record-card__highlights {
  margin: 0;
  padding-left: 1.1rem;
  color: #1e293b;
  display: grid;
  gap: 0.5rem;
}

.dataset-details__empty {
  margin: 0;
  text-align: center;
  padding: 2rem 1rem;
  color: #64748b;
  font-weight: 500;
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

.dataset-details__empty-state {
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

@media (max-width: 900px) {
  .dataset-details__record-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .dataset-details__records-header {
    gap: 1rem;
  }

  .dataset-details__actions {
    justify-content: stretch;
  }

  .request-button {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .dataset-details__hero {
    padding: 1.75rem;
  }

  .dataset-details__record-grid {
    grid-template-columns: 1fr;
  }

  .record-card {
    padding: 1.25rem;
  }

  .record-card__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .record-card__status {
    align-self: flex-start;
  }
}
</style>
