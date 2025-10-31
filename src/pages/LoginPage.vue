<template>
  <main class="page" aria-labelledby="login-card-heading">
    <section class="card">
      <div class="card__header">
        <div class="logo" aria-hidden="true" >
          <img src="../assets/logo-pertamina.png" alt="Pertamina Hulu Indonesia" height="70"/>
        </div>
        <div class="title-group">
          
        </div>
      </div>
      <h1 id="login-card-heading">Platform Sharing Data</h1>

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
  justify-content: center;
  gap: 1.25rem;
}

.logo {
 
  align-items: center;
  justify-content: center;
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
