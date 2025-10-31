<template>
  <main v-if="!isAuthenticated" class="page">
    <section class="card" aria-labelledby="login-card-heading">
      <div class="card__header">
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
        <div class="title-group">
          <p class="subtitle">PERTAMINA<br /><span>HULU INDONESIA</span></p>
          <h1 id="login-card-heading">Platform Sharing Data</h1>
        </div>
      </div>

      <div class="card__welcome">
        <h2>Welcome</h2>
        <p>Access secure platform resources with your company account.</p>
      </div>

      <form class="card__form" @submit.prevent="handleLogin" novalidate>
        <label class="field" for="username">
          <span>ID/Account</span>
          <input
            id="username"
            v-model="form.username"
            type="text"
            name="username"
            autocomplete="username"
            required
            placeholder="Enter your ID"
          />
        </label>

        <label class="field" for="password">
          <span>Password</span>
          <input
            id="password"
            v-model="form.password"
            type="password"
            name="password"
            autocomplete="current-password"
            required
            placeholder="Enter your password"
          />
        </label>

        <p v-if="errorMessage" class="status status--error" role="alert">{{ errorMessage }}</p>
        <p v-if="successMessage" class="status status--success" role="status">{{ successMessage }}</p>

        <button type="submit" class="submit">Log in</button>
      </form>

      <footer class="card__footer">
        <small>Demo credentials — Username: <code>{{ validUsername }}</code>, Password: <code>{{ validPassword }}</code></small>
      </footer>
    </section>
  </main>

  <main v-else class="dashboard" aria-labelledby="dashboard-heading">
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
import { reactive, ref } from 'vue';

const VALID_USERNAME = 'pertamina';
const VALID_PASSWORD = 'phidemo123';

const form = reactive({
  username: '',
  password: '',
});

const errorMessage = ref('');
const successMessage = ref('');
const isAuthenticated = ref(false);

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

const validUsername = VALID_USERNAME;
const validPassword = VALID_PASSWORD;

const resetMessages = () => {
  errorMessage.value = '';
  successMessage.value = '';
};

const handleLogin = () => {
  resetMessages();

  if (!form.username || !form.password) {
    errorMessage.value = 'Please enter both your ID/Account and password.';
    return;
  }

  if (form.username === VALID_USERNAME && form.password === VALID_PASSWORD) {
    successMessage.value = 'Login successful! Redirecting to your dashboard.';
    setTimeout(() => {
      isAuthenticated.value = true;
      successMessage.value = '';
    }, 800);
  } else {
    errorMessage.value = 'Invalid credentials. Please check your ID/Account or password and try again.';
  }
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

.page {
  width: 100%;
  max-width: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.card {
  width: min(480px, 100%);
  background: #ffffff;
  border-radius: 24px;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  box-shadow: 0 24px 60px rgba(37, 56, 88, 0.18);
  border: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.card__header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.logo {
  width: clamp(72px, 20vw, 88px);
  height: auto;
}

.logo svg {
  width: 100%;
  height: auto;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: #0f172a;
}

.subtitle {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
}

.subtitle span {
  color: #0086d1;
}

h1 {
  font-size: clamp(1.35rem, 2.7vw, 1.8rem);
  font-weight: 700;
  margin: 0;
}

.card__welcome h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.card__welcome p {
  margin: 0.35rem 0 0;
  color: #475569;
  font-size: 0.9rem;
}

.card__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #1f2937;
}

.field span {
  font-weight: 600;
}

.field input {
  border: 1px solid rgba(148, 163, 184, 0.7);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input:focus {
  outline: none;
  border-color: #0f9bd7;
  box-shadow: 0 0 0 4px rgba(15, 155, 215, 0.15);
}

.status {
  margin: -0.5rem 0 0;
  font-size: 0.85rem;
  line-height: 1.4;
}

.status--error {
  color: #d91d1d;
}

.status--success {
  color: #0f9d58;
}

.submit {
  background: linear-gradient(135deg, #0f9bd7, #1a5bd7);
  border: none;
  color: #fff;
  font-weight: 600;
  border-radius: 14px;
  padding: 0.9rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(26, 91, 215, 0.25);
}

.submit:active {
  transform: translateY(0);
}

.card__footer {
  display: flex;
  justify-content: center;
  text-align: center;
  color: #64748b;
  font-size: 0.8rem;
}

.card__footer code {
  font-family: 'Roboto Mono', 'Fira Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  color: #1a5bd7;
}

@media (max-width: 480px) {
  .card {
    border-radius: 18px;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .card__header {
    flex-direction: column;
    text-align: center;
  }

  .title-group {
    align-items: center;
  }
}

.dashboard {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f8ff 0%, #f8fafc 100%);
  padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 5vw, 4rem);
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3rem);
}

.dashboard__nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 20px;
  padding: 1rem 1.5rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #0f172a;
}

.brand__name {
  font-size: 1rem;
  line-height: 1.2;
}

.profile-button {
  background: #1a5bd7;
  border: none;
  color: #fff;
  font-weight: 600;
  padding: 0.65rem 1.4rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(26, 91, 215, 0.25);
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.profile-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 36px rgba(26, 91, 215, 0.3);
}

.dashboard__content {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3rem);
}

.dashboard__header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: #fff;
  border-radius: 24px;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.dashboard__header > div:first-child {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.eyebrow {
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
  color: #1a5bd7;
}

.dashboard__header h1 {
  margin: 0;
  font-size: clamp(1.75rem, 4vw, 2.4rem);
  color: #0f172a;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.filters__select {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.filters__select select {
  appearance: none;
  -webkit-appearance: none;
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 999px;
  padding: 0.55rem 2.5rem 0.55rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1f2937;
  background: #f8fafc;
  cursor: pointer;
}

.filters__select svg {
  position: absolute;
  right: 1rem;
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  color: #1f2937;
}

.filters__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.filters__tag {
  border: none;
  background: #e0e7ff;
  color: #1e3a8a;
  font-weight: 600;
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
}

.filters__tag[aria-pressed='true'] {
  background: #1a5bd7;
  color: #fff;
  transform: translateY(-1px);
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: #fff;
  border-radius: 24px;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.categories__header {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.categories__header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.categories__header p {
  margin: 0;
  color: #64748b;
}

.categories__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.category-card {
  background: #f1f5ff;
  border: 1px solid rgba(30, 64, 175, 0.12);
  border-radius: 18px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #1f2937;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.category-card:focus-visible,
.category-card:hover {
  transform: translateY(-4px);
  border-color: rgba(26, 91, 215, 0.35);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
}

.category-card__icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #1a5bd7;
  background: linear-gradient(135deg, rgba(26, 91, 215, 0.12), rgba(26, 91, 215, 0.04));
}

.category-card__icon svg {
  width: 36px;
  height: 36px;
}

.category-card__body h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.category-card__body p {
  margin: 0.3rem 0 0;
  color: #475569;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1.5rem;
  }

  .dashboard__nav {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .categories__grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>
