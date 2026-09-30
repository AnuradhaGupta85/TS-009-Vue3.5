<script setup lang="ts">
defineProps<{ open: boolean; title: string; message: string; confirmLabel?: string }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true">
    <div class="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl">
      <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-danger">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M10.3 3.2 2.2 17a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0Z"/></svg>
      </div>
      <h2 class="text-lg font-bold">{{ title }}</h2>
      <p class="mt-2 text-sm leading-6 text-text-secondary">{{ message }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button class="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-surface-muted" @click="emit('cancel')">Cancel</button>
        <button class="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-red-700" @click="emit('confirm')">{{ confirmLabel || 'Delete' }}</button>
      </div>
    </div>
  </div>
</template>
