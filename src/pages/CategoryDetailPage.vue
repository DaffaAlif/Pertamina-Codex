<template>
  <main class="category-detail" aria-labelledby="category-detail-heading">
    <AppHeader />

    <section v-if="category" class="category-detail__content">
      <div class="category-detail__intro">
        <button type="button" class="back-link" @click="goBack">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M9.78 3.97a.75.75 0 0 1 0 1.06L6.06 8.75l3.72 3.72a.75.75 0 1 1-1.06 1.06L4.47 9.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" fill="currentColor" />
          </svg>
          <span>Back to Discover</span>
        </button>

        <p class="eyebrow">Category</p>
        <h1 id="category-detail-heading">{{ category.name }}</h1>
        <p class="category-detail__summary">{{ categorySummary }}</p>

        <div class="category-detail__stats" role="list">
          <span role="listitem"><strong>{{ datasetCountLabel }}</strong> curated datasets</span>
          <span v-if="category.datasets" role="listitem"><strong>{{ category.datasets }}</strong> total assets cataloged</span>
        </div>
      </div>

      <div v-if="categoryDatasets.length" class="category-detail__list" role="list">
        <article
          v-for="dataset in categoryDatasets"
          :key="dataset.id"
          class="dataset-card"
          role="listitem"
          tabindex="0"
          :aria-label="`Open ${dataset.title}`"
          @click="openDataset(dataset.id)"
          @keyup.enter="openDataset(dataset.id)"
          @keyup.space.prevent="openDataset(dataset.id)"
        >
          <header class="dataset-card__header">
            <span class="dataset-card__domain">{{ dataset.domain }}</span>
            <span class="dataset-card__updated">Updated {{ formatDate(dataset.lastUpdated) }}</span>
          </header>

          <h2 class="dataset-card__title">{{ dataset.title }}</h2>
          <p class="dataset-card__summary">{{ dataset.summary }}</p>

          <ul class="dataset-card__tags" role="list">
            <li v-for="tag in dataset.tags" :key="tag" role="listitem">{{ tag }}</li>
          </ul>

          <footer class="dataset-card__footer">
            <div class="dataset-card__stat">
              <span class="dataset-card__stat-value">{{ dataset.heroStat }}</span>
              <span class="dataset-card__stat-label">{{ dataset.heroLabel }}</span>
            </div>

            <div class="dataset-card__cta" aria-hidden="true">
              <span>View dataset</span>
              <svg viewBox="0 0 16 16">
                <path d="M5.22 3.97a.75.75 0 0 1 1.06 0L10 7.69 6.28 11.4a.75.75 0 1 1-1.06-1.06l2.47-2.47-2.47-2.46a.75.75 0 0 1 0-1.06Z" fill="currentColor" />
              </svg>
            </div>
          </footer>
        </article>
      </div>

      <p v-else class="category-detail__empty">No datasets are currently mapped to this category. Please check back later.</p>
    </section>

    <section v-else class="category-detail__empty-state">
      <div class="empty-card">
        <h1>Category not found</h1>
        <p>The category you are looking for is not available. Return to the dashboard to browse the catalog.</p>
        <button type="button" class="back-link back-link--emphasis" @click="goBack">Back to Discover</button>
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

<style scoped>
.category-detail {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(226, 232, 240, 0.4) 0%, rgba(248, 250, 252, 0.85) 40%, #ffffff 100%);
  color: #0f172a;
}

.category-detail__content {
  flex: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(1.75rem, 3vw, 2.75rem) clamp(1.5rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

.category-detail__intro {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
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

.category-detail__summary {
  margin: 0;
  color: #475569;
  line-height: 1.55;
  font-size: 1.05rem;
}

.category-detail__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  color: #475569;
  font-size: 0.95rem;
}

.category-detail__stats strong {
  color: #0f172a;
}

.category-detail__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}

.dataset-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 18px;
  background: linear-gradient(150deg, rgba(226, 232, 240, 0.5) 0%, rgba(244, 249, 255, 0.85) 45%, #ffffff 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dataset-card:hover,
.dataset-card:focus {
  outline: none;
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

.dataset-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.dataset-card__domain {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0f172a;
}

.dataset-card__updated {
  font-size: 0.85rem;
  color: #64748b;
}

.dataset-card__title {
  margin: 0;
  font-size: 1.2rem;
  color: #0f172a;
}

.dataset-card__summary {
  margin: 0;
  color: #475569;
  line-height: 1.45;
}

.dataset-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dataset-card__tags li {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0ea5e9;
  background: rgba(14, 165, 233, 0.12);
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
}

.dataset-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.dataset-card__stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dataset-card__stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.dataset-card__stat-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.dataset-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
  color: #0284c7;
}

.dataset-card__cta svg {
  width: 1rem;
  height: 1rem;
}

.category-detail__empty {
  margin: 0;
  padding: 2.5rem;
  border-radius: 18px;
  background: rgba(226, 232, 240, 0.35);
  color: #475569;
  font-size: 1rem;
  text-align: center;
}

.category-detail__empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.empty-card {
  max-width: 420px;
  padding: 2.5rem;
  border-radius: 20px;
  background: linear-gradient(150deg, rgba(226, 232, 240, 0.5) 0%, rgba(244, 249, 255, 0.85) 60%, #ffffff 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.empty-card h1 {
  margin: 0;
  font-size: 1.8rem;
}

.empty-card p {
  margin: 0;
  color: #475569;
  line-height: 1.55;
}

@media (max-width: 640px) {
  .category-detail__content {
    padding: 1.75rem 1.25rem;
  }
}
</style>
