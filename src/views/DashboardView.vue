<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MetricCard from '../components/MetricCard.vue'
import { useTransactionStore } from '../stores/transactions'
import type { Transaction } from '../types'

const router = useRouter()
const store = useTransactionStore()
const loading = ref(true)
const records = ref<Transaction[]>([])

onMounted(async () => {
  records.value = await store.getAll()
  loading.value = false
})

const income = computed(() => records.value.filter((item) => item.type === 'Income').reduce((total, item) => total + item.amount, 0))
const expenses = computed(() => records.value.filter((item) => item.type === 'Expense').reduce((total, item) => total + item.amount, 0))
const categoryTotals = computed(() => Object.entries(records.value.filter((item) => item.type === 'Expense').reduce<Record<string, number>>((groups, item) => {
  groups[item.category] = (groups[item.category] || 0) + item.amount
  return groups
}, {})).sort((first, second) => second[1] - first[1]))
const recent = computed(() => [...records.value].sort((first, second) => second.date.localeCompare(first.date)).slice(0, 5))
const currency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
</script>

<template>
  <section>
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div><p class="text-sm font-medium text-primary">Overview</p><h1 class="mt-1 text-3xl font-bold tracking-tight">Good morning, Jordan</h1></div>
      <button class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-primary-hover" @click="router.push('/transactions/new')"><span class="text-lg">+</span>Add transaction</button>
    </div>
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><div v-for="number in 4" :key="number" class="h-32 animate-pulse rounded-2xl bg-slate-200" /></div>
    <template v-else>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total income" :value="currency(income)" tone="success" /><MetricCard label="Total expenses" :value="currency(expenses)" tone="danger" /><MetricCard label="Current balance" :value="currency(income - expenses)" tone="primary" /><MetricCard label="Transactions" :value="String(records.length)" tone="info" />
      </div>
      <div v-if="!records.length" class="mt-6 rounded-2xl border border-dashed border-border bg-surface p-12 text-center"><h2 class="text-lg font-bold">No transactions yet</h2><p class="mt-2 text-text-secondary">Add your first transaction to start tracking your spending.</p><button class="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white" @click="router.push('/transactions/new')">Add transaction</button></div>
      <div v-else class="mt-6 grid gap-6 xl:grid-cols-5">
        <article class="rounded-2xl border border-border bg-surface p-6 shadow-card xl:col-span-2"><h2 class="text-lg font-bold">Spending by category</h2><p class="mt-1 text-sm text-text-secondary">Your expense distribution</p><div class="mt-6 space-y-5"><div v-for="[category, total] in categoryTotals" :key="category"><div class="mb-2 flex justify-between text-sm"><span class="font-medium">{{ category }}</span><span class="text-text-secondary">{{ currency(total) }}</span></div><div class="h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-primary" :style="{ width: `${Math.min(100, (total / expenses) * 100)}%` }" /></div></div></div></article>
        <article class="rounded-2xl border border-border bg-surface p-6 shadow-card xl:col-span-3"><div class="flex items-center justify-between"><div><h2 class="text-lg font-bold">Recent transactions</h2><p class="mt-1 text-sm text-text-secondary">Latest activity in your account</p></div><button class="text-sm font-semibold text-primary hover:text-primary-hover" @click="router.push('/transactions')">View all</button></div><div class="mt-5 divide-y divide-border"><button v-for="item in recent" :key="item.id" class="flex w-full items-center justify-between py-4 text-left hover:bg-surface-muted" @click="router.push(`/transactions/${item.id}/edit`)"><div><p class="font-semibold">{{ item.description }}</p><p class="mt-1 text-xs text-text-secondary">{{ item.category }} · {{ item.date }}</p></div><span :class="item.type === 'Income' ? 'text-success' : 'text-danger'" class="font-bold">{{ item.type === 'Income' ? '+' : '-' }}{{ currency(item.amount) }}</span></button></div></article>
      </div>
    </template>
  </section>
</template>
