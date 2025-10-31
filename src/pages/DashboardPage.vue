<template>
  <main class="dashboard" aria-labelledby="dashboard-heading">
    <header class="dashboard__nav">
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
    </header>

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
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';

const filterOptions = ['Value', 'Date Added', 'Usage', 'Team'];
const labels = ['Value', 'Efficiency', 'Reliability', 'Costs', 'Sustainability'];
const selectedFilter = ref(filterOptions[0]);
const activeLabel = ref(labels[0]);

const categories = [
  { name: 'Production', datasets: 85, icon: 'cog' },
  { name: 'Reservoirs', datasets: 42, icon: 'droplet' },
  { name: 'Connectivity', datasets: 29, icon: 'network' },
  { name: 'Exploration', datasets: 64, icon: 'radar' },
  { name: 'Analytics', datasets: 91, icon: 'analytics' },
  { name: 'Safety & Risk', datasets: 37, icon: 'shield' },
  { name: 'Geospatial', datasets: 53, icon: 'globe' },
  { name: 'Infrastructure', datasets: 48, icon: 'pipeline' },
];
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
  width: min(1120px, 100%);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.dashboard__nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(1.5rem, 3vw, 2.25rem) clamp(1.5rem, 4vw, 3rem);
  background: linear-gradient(120deg, #0f172a 0%, #1e293b 65%, #0f172a 100%);
  color: #ffffff;
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

.dashboard__content {
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

@media (max-width: 768px) {
  .dashboard {
    border-radius: 24px;
  }

  .dashboard__content {
    padding: 1.75rem;
  }
}

@media (max-width: 640px) {
  .dashboard {
    border-radius: 20px;
  }

  .dashboard__nav,
  .dashboard__content {
    padding: 1.5rem;
  }

  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filters__tags {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
