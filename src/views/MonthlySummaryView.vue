<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MetricCard from '../components/MetricCard.vue'
import { useTransactionStore } from '../stores/transactions'
import type { Transaction } from '../types'

const store = useTransactionStore()
const loading = ref(true)
const records = ref<Transaction[]>([])
const selectedMonth = ref(new Date().toISOString().slice(0, 7))
onMounted(async () => { records.value = await store.getAll(); loading.value = false })
const monthly = computed(() => records.value.filter((item) => item.date.startsWith(selectedMonth.value)))
const income = computed(() => monthly.value.filter((item) => item.type === 'Income').reduce((total, item) => total + item.amount, 0))
const expenses = computed(() => monthly.value.filter((item) => item.type === 'Expense').reduce((total, item) => total + item.amount, 0))
const breakdown = computed(() => Object.entries(monthly.value.filter((item) => item.type === 'Expense').reduce<Record<string, number>>((groups, item) => { groups[item.category] = (groups[item.category] || 0) + item.amount; return groups }, {})).sort((first, second) => second[1] - first[1]))
const currency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
</script>

<template>
  <section><div class="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p class="text-sm font-medium text-primary">Look back</p><h1 class="mt-1 text-3xl font-bold">Monthly summary</h1><p class="mt-2 text-text-secondary">A focused breakdown of your chosen month.</p></div><label class="text-sm font-semibold">Select month<input v-model="selectedMonth" type="month" class="ml-3 rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-primary" /></label></div><div v-if="loading" class="grid gap-4 md:grid-cols-3"><div v-for="number in 3" :key="number" class="h-32 animate-pulse rounded-2xl bg-slate-200" /></div><template v-else><div class="grid gap-4 md:grid-cols-3"><MetricCard label="Monthly income" :value="currency(income)" tone="success" /><MetricCard label="Monthly expenses" :value="currency(expenses)" tone="danger" /><MetricCard label="Monthly balance" :value="currency(income - expenses)" tone="primary" /></div><article class="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-card"><h2 class="text-lg font-bold">Expense category breakdown</h2><p class="mt-1 text-sm text-text-secondary">Where your money went in {{ selectedMonth }}.</p><div v-if="!monthly.length" class="py-12 text-center"><h3 class="font-bold">No data for this month</h3><p class="mt-2 text-sm text-text-secondary">Choose another month or add a transaction.</p></div><div v-else class="mt-6 space-y-5"><div v-for="[category, total] in breakdown" :key="category"><div class="mb-2 flex justify-between text-sm"><span class="font-semibold">{{ category }}</span><span class="text-text-secondary">{{ currency(total) }}</span></div><div class="h-3 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-primary" :style="{ width: `${Math.min(100, (total / expenses) * 100)}%` }" /></div></div></div></article></template></section>
</template>
