<template>
  <main class="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12 sm:px-10">
    <section class="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-2xl shadow-brand-dark/10 backdrop-blur">
      <div class="flex items-center gap-5">
        <div class="justify-center items-center w-full flex mb-5" aria-hidden="true">
          <img src="../assets/logo-pertamina.png" alt="Pertamina Hulu Indonesia" class="h-[65px] w-[180px]" />
        </div>
        <div class="title-group">
         
      
        </div>
      </div>
      <h1 id="login-card-heading">Platform Sharing Data</h1>

      <div class="mt-8 space-y-2">
        <h2 class="text-lg font-semibold text-brand-dark">Welcome</h2>
        <p class="text-sm text-slate-600">Access secure platform resources with your company account.</p>
      </div>

      <form class="mt-8 flex flex-col gap-5" @submit.prevent="handleLogin" novalidate>
        <label class="flex flex-col gap-2 text-sm font-medium text-slate-700" for="username">
          <span>ID/Account</span>
          <input
            id="username"
            v-model="form.username"
            type="text"
            name="username"
            autocomplete="username"
            required
            placeholder="Enter your ID"
            class="rounded-xl border border-slate-300/80 px-4 py-3 text-base font-medium text-slate-800 shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
          />
        </label>

        <label class="flex flex-col gap-2 text-sm font-medium text-slate-700" for="password">
          <span>Password</span>
          <input
            id="password"
            v-model="form.password"
            type="password"
            name="password"
            autocomplete="current-password"
            required
            placeholder="Enter your password"
            class="rounded-xl border border-slate-300/80 px-4 py-3 text-base font-medium text-slate-800 shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
          />
        </label>

        <p
          v-if="errorMessage"
          class="rounded-2xl border border-red-200 bg-red-100/60 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {{ errorMessage }}
        </p>
        <p
          v-if="successMessage"
          class="rounded-2xl border border-emerald-200 bg-emerald-100/60 px-4 py-3 text-sm font-medium text-emerald-700"
          role="status"
        >
          {{ successMessage }}
        </p>

        <button
          type="submit"
          class="mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-brand-primary px-4 py-3 text-base font-semibold text-white shadow-lg shadow-sky-200/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          Log in
        </button>
      </form>

      <footer class="mt-8 text-center text-xs text-slate-500">
        <small>
          Demo credentials — Username: <code class="rounded-md bg-slate-900/5 px-1.5 py-0.5 font-mono text-slate-700">{{
            validUsername
          }}</code>,
          Password: <code class="rounded-md bg-slate-900/5 px-1.5 py-0.5 font-mono text-slate-700">{{ validPassword }}</code>
        </small>
      </footer>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';

const emit = defineEmits(['authenticated']);

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
    successMessage.value = 'Login successful! Redirecting to your dashboard.';
    setTimeout(() => {
      emit('authenticated');
      successMessage.value = '';
    }, 800);
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
  min-height: 100vh;
  padding: clamp(1.5rem, 4vw, 3rem);
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
  border-color: #0086d1;
  box-shadow: 0 0 0 3px rgba(0, 134, 209, 0.2);
}

.submit {
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #0086d1, #0ea5e9);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 32px rgba(14, 165, 233, 0.25);
}

.status {
  margin: 0;
  font-size: 0.85rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 500;
}

.status--error {
  background: rgba(248, 113, 113, 0.1);
  color: #b91c1c;
  border: 1px solid rgba(248, 113, 113, 0.4);
}

.status--success {
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
  border: 1px solid rgba(74, 222, 128, 0.35);
}

.card__footer {
  text-align: center;
  font-size: 0.8rem;
  color: #64748b;
}

code {
  font-family: 'Fira Code', 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
  background: rgba(15, 23, 42, 0.05);
  padding: 0.1rem 0.35rem;
  border-radius: 6px;
}

@media (max-width: 640px) {
  .page {
    padding: 0 1rem;
  }

  .card {
    border-radius: 20px;
  }
}
</style>
