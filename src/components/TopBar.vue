<script setup lang="ts">
import { useSettingsStore } from '../stores/settings'
import { SUPPORTED_CURRENCIES } from '../utils/currency'

const settings = useSettingsStore()
</script>

<template>
  <header class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-surface/95 px-5 backdrop-blur md:px-8">
    <RouterLink to="/dashboard" class="flex items-center gap-2 text-lg font-bold text-text-primary md:hidden">
      <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">$</span>
      Spendly
    </RouterLink>
    <div class="hidden text-sm text-text-secondary md:block">Personal finance overview</div>
    <div class="flex items-center gap-3">
      <label class="hidden items-center gap-2 text-sm text-text-secondary sm:flex">
        <span class="sr-only">Currency</span>
        <select
          :value="settings.currency"
          class="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-text-primary outline-none focus:border-primary"
          aria-label="Select currency"
          @change="settings.setCurrency(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="option in SUPPORTED_CURRENCIES" :key="option.code" :value="option.code">{{ option.code }}</option>
        </select>
      </label>
      <button
        class="rounded-lg p-2 text-text-secondary transition hover:bg-surface-muted hover:text-primary"
        :aria-label="settings.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="settings.toggleDark"
      >
        <svg v-if="settings.isDark" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"/></svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
      </button>
      <button class="rounded-lg p-2 text-text-secondary transition hover:bg-surface-muted hover:text-primary" aria-label="Notifications">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>
      </button>
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-primary">JD</div>
    </div>
  </header>
</template>
