<template>
  <header class="app-header">
    <div class="app-header__inner">
      <div class="app-header__brand" aria-label="Pertamina Hulu Indonesia">
        <div class="app-header__logo" aria-hidden="true">
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
        <span class="app-header__name">Pertamina Hulu Indonesia</span>
      </div>

      <div class="app-header__actions">
        <slot name="actions">
          <button type="button" class="app-header__profile-button">My Profile</button>
        </slot>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: clamp(1.5rem, 3vw, 2.25rem) clamp(1.5rem, 4vw, 3rem);
  color: #0f172a;
}

.app-header__inner {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-header__logo {
  width: clamp(64px, 12vw, 76px);
}

.app-header__logo svg {
  width: 100%;
  height: auto;
}

.app-header__name {
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-header__profile-button {
  background-color: #0f172a;
  color: #ffffff;
  border: 1px solid #0f172a;
  border-radius: 999px;
  padding: 0.65rem 1.35rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.app-header__profile-button:hover,
.app-header__profile-button:focus-visible {
  background-color: #172554;
  border-color: #172554;
  transform: translateY(-1px);
}

.app-header__profile-button:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.35);
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .app-header__inner {
    justify-content: center;
  }

  .app-header__actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
