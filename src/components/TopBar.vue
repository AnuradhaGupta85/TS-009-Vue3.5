<template>
  <header class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-surface/95 px-5 backdrop-blur md:px-8">
    <RouterLink to="/dashboard" class="flex items-center gap-2 text-lg font-bold text-text-primary md:hidden">
      <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">$</span>
      Spendly
    </RouterLink>
    <div class="hidden text-sm text-text-secondary md:block">Personal finance overview</div>
    <div class="flex items-center gap-3">
      <button class="rounded-lg p-2 text-text-secondary transition hover:bg-surface-muted hover:text-primary" aria-label="Notifications">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>
      </button>
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-primary">JD</div>
    </div>
  </header>
</template>
