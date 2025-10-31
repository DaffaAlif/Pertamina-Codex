<template>
  <main class="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12 sm:px-10">
    <section class="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-2xl shadow-brand-dark/10 backdrop-blur">
      <div class="flex items-center gap-5">
        <div class="w-20 shrink-0 sm:w-24" aria-hidden="true">
          <svg viewBox="0 0 120 32" role="presentation" class="h-auto w-full">
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
        <div class="flex flex-col gap-1 text-brand-dark">
          <p class="text-xs font-bold uppercase leading-tight tracking-[0.12em]">
            PERTAMINA<br /><span class="text-sky-600">HULU INDONESIA</span>
          </p>
          <h1 id="login-card-heading" class="text-2xl font-semibold sm:text-3xl">Platform Sharing Data</h1>
        </div>
      </div>

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
