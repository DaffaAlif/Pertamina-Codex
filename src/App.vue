<template>
  <main class="page">
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
    successMessage.value = 'Login successful! Welcome to Platform Sharing Data.';
  } else {
    errorMessage.value = 'Invalid credentials. Please check your ID/Account or password and try again.';
  }
};
</script>

<style scoped>
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
</style>
