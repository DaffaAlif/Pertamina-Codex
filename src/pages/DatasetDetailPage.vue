<template>
  <main class="dataset-detail" aria-labelledby="dataset-detail-heading">
    <AppHeader />

    <section v-if="dataset" class="dataset-detail__content">
      <button type="button" class="back-link" @click="goBack">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M9.78 3.97a.75.75 0 0 1 0 1.06L6.06 8.75l3.72 3.72a.75.75 0 1 1-1.06 1.06L4.47 9.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
            fill="currentColor"
          />
        </svg>
        <span>{{ backLinkLabel }}</span>
      </button>

      <div class="dataset-detail__intro">
        <p class="dataset-detail__eyebrow">Dataset</p>
        <h1 id="dataset-detail-heading">{{ dataset.title }}</h1>
        <p class="dataset-detail__description">{{ dataset.summary }}</p>

        <dl class="dataset-detail__meta">
          <div>
            <dt>Domain</dt>
            <dd>{{ dataset.domain }}</dd>
          </div>
          <div>
            <dt>Owner</dt>
            <dd>{{ dataset.owner }}</dd>
          </div>
          <div>
            <dt>Data Type</dt>
            <dd>{{ dataset.dataType }}</dd>
          </div>
          <div>
            <dt>Last Updated</dt>
            <dd>{{ formatDateLong(dataset.lastUpdated) }}</dd>
          </div>
        </dl>

        <div v-if="tags.length" class="dataset-detail__tags" role="list">
          <span v-for="tag in tags" :key="tag" role="listitem">{{ tag }}</span>
        </div>
      </div>

      <section class="dataset-detail__preview" aria-labelledby="dataset-preview-heading">
        <div class="dataset-detail__preview-header">
          <h2 id="dataset-preview-heading">Preview</h2>
          <p>Recent files and outputs associated with this dataset.</p>
        </div>

        <div class="dataset-detail__table" role="region" aria-live="polite">
          <table>
            <thead>
              <tr>
                <th scope="col">Last Uploaded</th>
                <th scope="col">Title</th>
                <th scope="col">Tags</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in previewRecords" :key="record.id">
                <td data-title="Last Uploaded">{{ formatRelativeDate(record.date) }}</td>
                <td data-title="Title">
                  <span class="dataset-detail__record-title">{{ record.label }}</span>
                  <span v-if="record.description" class="dataset-detail__record-description">
                    {{ record.description }}
                  </span>
                </td>
                <td data-title="Tags">
                  <span>{{ formatRecordTags(record) }}</span>
                </td>
              </tr>
              <tr v-if="!previewRecords.length">
                <td colspan="3" class="dataset-detail__empty">No preview files are available for this dataset yet.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="dataset-detail__actions">
          <button type="button" class="request-button" @click="requestAccess">Request</button>
        </div>
      </section>
    </section>

    <section v-else class="dataset-detail__empty-state">
      <div class="empty-card">
        <h1>Dataset not found</h1>
        <p>The dataset you are looking for is not available. Return to the dashboard to browse the catalog.</p>
        <button type="button" class="back-link back-link--emphasis" @click="goBack">Back to Discover</button>
      </div>
    </section>
  </main>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';
import { computed } from 'vue';
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

const formatRecordTags = (record) => {
  if (Array.isArray(record.tags) && record.tags.length) {
    return record.tags.join(', ');
  }
  return tags.value.join(', ');
};

const formatRelativeDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffInMs = todayStart - dateStart;
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return formatter.format(date);
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
  gap: 2rem;
}

.dataset-detail__intro {
  background: linear-gradient(140deg, rgba(226, 232, 240, 0.55) 0%, rgba(241, 245, 249, 0.65) 65%, #ffffff 100%);
  border-radius: 24px;
  padding: clamp(1.75rem, 3vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

.dataset-detail__eyebrow {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.4em;
  margin: 0;
  color: #94a3b8;
  font-weight: 600;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.6rem);
  line-height: 1.2;
}

.dataset-detail__description {
  margin: 0;
  color: #475569;
  line-height: 1.6;
  font-size: 1.05rem;
}

.dataset-detail__meta {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.25rem;
}

.dataset-detail__meta div {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.dataset-detail__meta dt {
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
}

.dataset-detail__meta dd {
  margin: 0;
  font-weight: 600;
  color: #0f172a;
  font-size: 1rem;
}

.dataset-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.dataset-detail__tags span {
  background: rgba(14, 165, 233, 0.12);
  color: #0284c7;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.dataset-detail__preview {
  background: #ffffff;
  border-radius: 24px;
  padding: clamp(1.75rem, 3vw, 2.5rem);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.dataset-detail__preview-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.dataset-detail__preview-header p {
  margin: 0.4rem 0 0;
  color: #64748b;
  font-size: 0.95rem;
}

.dataset-detail__table {
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.dataset-detail__table table {
  width: 100%;
  border-collapse: collapse;
  background: #f8fafc;
}

.dataset-detail__table thead {
  background: #1d4ed8;
  color: #ffffff;
}

.dataset-detail__table th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.dataset-detail__table td {
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  vertical-align: top;
  font-size: 0.95rem;
  color: #0f172a;
  background: #ffffff;
}

.dataset-detail__table tr:nth-child(even) td {
  background: #f1f5f9;
}

.dataset-detail__record-title {
  display: block;
  font-weight: 600;
}

.dataset-detail__record-description {
  display: block;
  margin-top: 0.35rem;
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.5;
}

.dataset-detail__empty {
  text-align: center;
  padding: 2rem 1rem;
  color: #64748b;
  font-weight: 500;
}

.dataset-detail__actions {
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

.dataset-detail__empty-state {
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

@media (max-width: 768px) {
  .dataset-detail__content {
    padding: 1.75rem 1.5rem;
    gap: 1.75rem;
  }

  .dataset-detail__intro,
  .dataset-detail__preview {
    padding: 1.5rem;
  }

  .dataset-detail__table {
    border-radius: 16px;
  }

  .dataset-detail__table table,
  .dataset-detail__table thead {
    display: block;
  }

  .dataset-detail__table thead tr {
    display: none;
  }

  .dataset-detail__table tbody {
    display: block;
  }

  .dataset-detail__table tr {
    display: block;
    border-top: 1px solid rgba(148, 163, 184, 0.25);
  }

  .dataset-detail__table td {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 0.5rem;
    border: none;
    background: transparent;
  }

  .dataset-detail__table td::before {
    content: attr(data-title);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
    font-weight: 600;
  }

  .dataset-detail__table tr:nth-child(even) td {
    background: transparent;
  }

  .dataset-detail__actions {
    justify-content: stretch;
  }

  .request-button {
    width: 100%;
  }
}
</style>
