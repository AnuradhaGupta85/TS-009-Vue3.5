<script setup lang="ts">
const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: 'home' },
  { label: 'Transactions', to: '/transactions', icon: 'arrows' },
  { label: 'Categories', to: '/categories', icon: 'tag' },
  { label: 'Monthly summary', to: '/monthly-summary', icon: 'calendar' },
]
</script>

<template>
  <aside class="hidden min-h-screen w-64 shrink-0 flex-col bg-text-primary p-5 text-slate-300 md:flex">
    <RouterLink to="/dashboard" class="mb-10 flex items-center gap-3 px-2 text-xl font-bold text-white">
      <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">$</span>
      Spendly
    </RouterLink>
    <nav class="space-y-2">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        active-class="bg-primary text-white shadow-lg"
        class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-slate-800 hover:text-white"
      >
        <svg v-if="item.icon === 'home'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9Z"/><path d="M9 21v-6h6v6"/></svg>
        <svg v-else-if="item.icon === 'arrows'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h14m0 0-4-4m4 4-4 4M17 17H3m0 0 4 4m-4-4 4-4"/></svg>
        <svg v-else-if="item.icon === 'tag'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13 11 22 2 13V2h11l9 9Z"/><circle cx="7" cy="7" r="1"/></svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4m8-4v4M3 10h18"/></svg>
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="mt-auto rounded-xl border border-slate-700 p-4 text-xs leading-5 text-slate-400">
      Stay on top of every dollar with a clear, simple overview.
    </div>
  </aside>
</template>
