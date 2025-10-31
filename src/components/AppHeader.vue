<template>
  <header class="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-6 sm:px-10 sm:py-8">
      <div class="flex items-center gap-4" aria-label="Pertamina Hulu Indonesia">
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
        <span class="text-lg font-semibold tracking-wide text-slate-900 sm:text-xl">Pertamina Hulu Indonesia</span>
      </div>

      <div class="flex w-full items-center justify-center gap-4 sm:w-auto sm:justify-end">
        <slot name="actions">
          <button
            type="button"
            class="rounded-full border border-brand-dark bg-brand-dark px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            My Profile
          </button>
        </slot>
      </div>
    </div>
  </header>
</template>
