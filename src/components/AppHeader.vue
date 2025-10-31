<template>
  <header class="app-header">
    <div class="app-header__inner">
      <div class="app-header__brand" aria-label="Pertamina Hulu Indonesia">
        <div class="app-header__logo" aria-hidden="true">
          <img src="../assets/logo-pertamina.png" alt="Pertamina Hulu Indonesia" height="60"/>
        </div>
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
