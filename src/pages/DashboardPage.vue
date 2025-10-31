<template>
  <main class="dashboard" aria-labelledby="dashboard-heading">
    <AppHeader />

    <section class="dashboard__content">
      <header class="dashboard__header">
        <div>
          <p class="eyebrow">Discover</p>
          <h1 id="dashboard-heading">Explore Datasets</h1>
        </div>

        <div class="filters" aria-label="Filter datasets">
          <label class="filters__select">
            <span class="sr-only">Sort by</span>
            <select v-model="selectedFilter" aria-label="Sort datasets">
              <option v-for="option in filterOptions" :key="option">{{ option }}</option>
            </select>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M4.47 5.03a.75.75 0 0 1 1.06 0L8 7.44l2.47-2.41a.75.75 0 1 1 1.06 1.06L8.53 8.97a.75.75 0 0 1-1.06 0L4.47 6.09a.75.75 0 0 1 0-1.06Z"
                fill="currentColor"
              />
            </svg>
          </label>

          <div class="filters__tags" role="list">
            <button
              v-for="label in labels"
              :key="label"
              type="button"
              class="filters__tag"
              :aria-pressed="activeLabel === label"
              @click="activeLabel = label"
            >
              {{ label }}
            </button>
          </div>
        </div>
      </header>

      <section class="categories" aria-label="Browse by category">
        <header class="categories__header">
          <h2>Browse by Category</h2>
          <p>{{ categories.length }} available categories</p>
        </header>

        <div class="categories__grid">
          <article
            v-for="category in categories"
            :key="category.name"
            class="category-card"
            tabindex="0"
            role="button"
            :aria-label="`${category.name} category with ${category.datasets} datasets`"
            @click="openCategory(category)"
            @keyup.enter="openCategory(category)"
            @keyup.space.prevent="openCategory(category)"
          >
            <div class="category-card__icon" aria-hidden="true">
              <svg v-if="category.icon === 'cog'" viewBox="0 0 48 48">
                <path
                  d="M24 17.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0-9a2 2 0 0 1 1.96 1.56l.54 2.4a2 2 0 0 0 1.36 1.47l2.33.77a2 2 0 0 1 1.08 2.98l-1.24 2.1a2 2 0 0 0 0 2l1.24 2.1a2 2 0 0 1-1.08 2.99l-2.33.76a2 2 0 0 0-1.36 1.47l-.54 2.41A2 2 0 0 1 24 39.5a2 2 0 0 1-1.96-1.56l-.54-2.41a2 2 0 0 0-1.36-1.47l-2.33-.76a2 2 0 0 1-1.08-2.99l1.24-2.1a2 2 0 0 0 0-2l-1.24-2.1a2 2 0 0 1 1.08-2.98l2.33-.77a2 2 0 0 0 1.36-1.47l.54-2.4A2 2 0 0 1 24 8.5Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else-if="category.icon === 'droplet'" viewBox="0 0 48 48">
                <path
                  d="M24 6c6.6 8.4 11 15.23 11 21.12C35 34.5 29.18 40 24 40s-11-5.5-11-12.88C13 21.23 17.4 14.4 24 6Zm0 29c3.07 0 6-2.76 6-7.88 0-3.3-2.1-7.25-6-11.93-3.9 4.68-6 8.63-6 11.93C18 32.24 20.93 35 24 35Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else-if="category.icon === 'network'" viewBox="0 0 48 48">
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
              <svg v-else-if="category.icon === 'radar'" viewBox="0 0 48 48">
                <path
                  d="M24 8a16 16 0 1 1-11.31 4.69l2.83 2.83A12 12 0 1 0 24 12v4a8 8 0 1 1-5.66 2.34l2.83 2.83A4 4 0 1 0 24 24V8Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else-if="category.icon === 'analytics'" viewBox="0 0 48 48">
                <path
                  d="M12 34h4V14h-4v20Zm10 0h4V20h-4v14Zm10 0h4V10h-4v24Z"
                  fill="currentColor"
                />
                <path
                  d="M10 36h28a2 2 0 1 1 0 4H10a2 2 0 1 1 0-4Z"
                  fill="currentColor"
                  opacity="0.8"
                />
              </svg>
              <svg v-else-if="category.icon === 'shield'" viewBox="0 0 48 48">
                <path
                  d="m24 6 13 5v11c0 8.84-5.61 16.78-13 20-7.39-3.22-13-11.16-13-20V11l13-5Zm0 7-7 2.7V22c0 6.11 3.44 11.9 7 14.65 3.56-2.75 7-8.54 7-14.65v-6.3L24 13Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else-if="category.icon === 'globe'" viewBox="0 0 48 48">
                <path
                  d="M24 6a18 18 0 1 1 0 36 18 18 0 0 1 0-36Zm0 4c-1.9 0-3.73.36-5.4 1.03 2.22 1.94 4.05 5.74 4.53 10.47h6.71a11.97 11.97 0 0 0-5.84-11.3ZM24 38c1.9 0 3.73-.36 5.4-1.03-2.22-1.94-4.05-5.74-4.53-10.47h-6.71A11.97 11.97 0 0 0 24 38Zm-8-12h-6.9a14 14 0 0 0 5.16 9.4c1.1-2.94 1.65-6.22 1.74-9.4Zm0-4c-.09-3.18-.64-6.46-1.74-9.4A14 14 0 0 0 9.1 22H16Zm16 4c.09 3.18.64 6.46 1.74 9.4A14 14 0 0 0 38.9 22H32Zm0-4h6.9a14 14 0 0 0-5.16-9.4c-1.1 2.94-1.65 6.22-1.74 9.4Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else-if="category.icon === 'pipeline'" viewBox="0 0 48 48">
                <path
                  d="M10 18a2 2 0 0 1 2-2h4V12a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2v-4h-4a2 2 0 0 1-2-2V18Zm8-4v4h12v-4H18Zm-6 6v10h4v-6h16v6h4V20H12Zm18 12H18v4h12v-4Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else viewBox="0 0 48 48">
                <path
                  d="M24 10a2 2 0 0 1 1.55.73l12 14a2 2 0 0 1-1.55 3.27H12a2 2 0 0 1-1.55-3.27l12-14A2 2 0 0 1 24 10Zm0 6.66-7.6 8.87h15.2L24 16.66ZM12 32h24a2 2 0 1 1 0 4H12a2 2 0 1 1 0-4Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div class="category-card__body">
              <h3>{{ category.name }}</h3>
              <p>{{ category.datasets }} Datasets</p>
            </div>
          </article>
        </div>
      </section>

      <section class="datasets" aria-label="Featured datasets">
        <header class="datasets__header">
          <div>
            <h2>Featured Datasets</h2>
            <p>{{ datasetCount }} curated data products</p>
          </div>

          <p class="datasets__hint">Select a dataset to explore rich metadata and records.</p>
        </header>

        <div class="datasets__list">
          <article
            v-for="dataset in availableDatasets"
            :key="dataset.id"
            class="dataset-card"
            role="button"
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

            <h3 class="dataset-card__title">{{ dataset.title }}</h3>
            <p class="dataset-card__summary">{{ dataset.summary }}</p>

            <ul class="dataset-card__tags" role="list">
              <li v-for="tag in dataset.tags" :key="tag">{{ tag }}</li>
            </ul>

            <footer class="dataset-card__footer">
              <div class="dataset-card__stat">
                <span class="dataset-card__stat-value">{{ dataset.heroStat }}</span>
                <span class="dataset-card__stat-label">{{ dataset.heroLabel }}</span>
              </div>

              <div class="dataset-card__cta" aria-hidden="true">
                <span>View dataset</span>
                <svg viewBox="0 0 16 16">
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
import { ref } from 'vue';
import { datasetCategories as categories, datasets as availableDatasets } from '../data/datasets.js';
import { useRouter } from '../router/simpleRouter.js';

const filterOptions = ['Value', 'Date Added', 'Usage', 'Team'];
const labels = ['Value', 'Efficiency', 'Reliability', 'Costs', 'Sustainability'];
const selectedFilter = ref(filterOptions[0]);
const activeLabel = ref(labels[0]);

const datasetCount = availableDatasets.length;
const router = useRouter();

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
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.dashboard {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(226, 232, 240, 0.4) 0%, rgba(248, 250, 252, 0.85) 40%, #ffffff 100%);
  color: #0f172a;
}

.dashboard__content {
  flex: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: flex-end;
  flex-wrap: wrap;
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
  margin: 0.35rem 0 0;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  color: #0f172a;
}

.filters {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filters__select {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.6);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  min-width: 180px;
}

.filters__select select {
  appearance: none;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.35rem 0.25rem;
}

.filters__select svg {
  position: absolute;
  right: 0.8rem;
  pointer-events: none;
  width: 1rem;
  height: 1rem;
  color: #1e293b;
}

.filters__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filters__tag {
  border: 1px solid rgba(148, 163, 184, 0.45);
  border-radius: 999px;
  padding: 0.55rem 1.15rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  background: #ffffff;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.filters__tag[aria-pressed='true'] {
  background: #0ea5e9;
  color: #ffffff;
  border-color: transparent;
  transform: translateY(-1px);
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.categories__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.categories__header h2 {
  margin: 0;
  font-size: clamp(1.35rem, 2.4vw, 1.8rem);
}

.categories__header p {
  margin: 0;
  color: #64748b;
  font-weight: 500;
}

.categories__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}

.category-card {
  background: linear-gradient(140deg, rgba(226, 232, 240, 0.45) 0%, rgba(241, 245, 249, 0.8) 50%, #ffffff 100%);
  border-radius: 18px;
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-card:hover,
.category-card:focus {
  outline: none;
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

.category-card__icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  background: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
  border-radius: 16px;
}

.category-card__icon svg {
  width: 32px;
  height: 32px;
}

.category-card__body h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #0f172a;
}

.category-card__body p {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-weight: 500;
}

.datasets {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.datasets__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.datasets__header h2 {
  margin: 0;
  font-size: clamp(1.35rem, 2.4vw, 1.8rem);
}

.datasets__header p {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-weight: 500;
}

.datasets__hint {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
  max-width: 320px;
}

.datasets__list {
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

@media (max-width: 768px) {
  .dashboard__content {
    padding: 2rem 1.75rem;
  }
}

@media (max-width: 640px) {
  .dashboard__content {
    padding: 1.75rem 1.25rem;
  }

  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filters__tags {
    width: 100%;
    justify-content: flex-start;
  }

  .datasets__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
