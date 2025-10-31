<template>
  <header class="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-6 sm:px-10 sm:py-8">
      <div class="flex items-center gap-4" aria-label="Pertamina Hulu Indonesia">
        <div class=" shrink-0 " aria-hidden="true">
          <img src="../assets/logo-pertamina.png" alt="Pertamina Hulu Indonesia" class="h-[65px] w-[180px]" />
        </div>
      </div>

      <div class="flex w-full items-center justify-center gap-4 sm:w-auto sm:justify-end">
        <slot name="actions">
          <button type="button"
            class="rounded-full border border-brand-dark bg-brand-dark px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
            My Profile
          </button>
        </slot>
      </div>
    </div>
  </header>
</template>
