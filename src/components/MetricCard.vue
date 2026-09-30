<script setup lang="ts">
defineProps<{
  label: string
  value: string
  tone: 'primary' | 'success' | 'danger' | 'info'
}>()
</script>

<template>
  <article class="rounded-2xl border border-border bg-surface p-5 shadow-card">
    <div class="mb-5 flex items-center justify-between">
      <p class="text-sm font-medium text-text-secondary">{{ label }}</p>
      <span :class="{ 'bg-indigo-100 text-primary': tone === 'primary', 'bg-green-100 text-success': tone === 'success', 'bg-red-100 text-danger': tone === 'danger', 'bg-sky-100 text-info': tone === 'info' }" class="flex h-10 w-10 items-center justify-center rounded-xl">
        <svg v-if="tone === 'primary'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <svg v-else-if="tone === 'success'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 15 7-7 7 7"/><path d="M12 8v13"/></svg>
        <svg v-else-if="tone === 'danger'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 9 7 7 7-7"/><path d="M12 3v13"/></svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4m8-4v4"/></svg>
      </span>
    </div>
    <p class="text-2xl font-bold tracking-tight text-text-primary">{{ value }}</p>
  </article>
</template>
