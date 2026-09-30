<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { useCategoryStore } from '../stores/categories'
import { useSettingsStore } from '../stores/settings'
import { useTransactionStore } from '../stores/transactions'
import type { Transaction } from '../types'
import { formatCurrency } from '../utils/currency'

const router = useRouter()
const toast = useToast()
const store = useTransactionStore()
const categoryStore = useCategoryStore()
const settings = useSettingsStore()
const records = ref<Transaction[]>([])
const loading = ref(true)
const deleting = ref<Transaction | null>(null)
const filters = reactive({ search: '', type: '', category: '', start: '', end: '', sort: 'date', direction: 'desc' })
const selected = ref<Set<string>>(new Set())
const bulkCategory = ref('')
const bulkDeleteOpen = ref(false)
const bulkCategorizeOpen = ref(false)

onMounted(async () => { records.value = await store.getAll(); await categoryStore.getAll(); loading.value = false })
const filtered = computed(() => [...records.value].filter((item) => (!filters.search || `${item.description} ${item.category}`.toLowerCase().includes(filters.search.toLowerCase())) && (!filters.type || item.type === filters.type) && (!filters.category || item.category === filters.category) && (!filters.start || item.date >= filters.start) && (!filters.end || item.date <= filters.end)).sort((first, second) => {
  const left = filters.sort === 'amount' ? first.amount : filters.sort === 'category' ? first.category : first.date
  const right = filters.sort === 'amount' ? second.amount : filters.sort === 'category' ? second.category : second.date
  const compare = typeof left === 'number' ? left - (right as number) : String(left).localeCompare(String(right))
  return filters.direction === 'asc' ? compare : -compare
}))
function clearFilters() { Object.assign(filters, { search: '', type: '', category: '', start: '', end: '', sort: 'date', direction: 'desc' }) }
async function confirmDelete() { if (deleting.value) { await store.remove(deleting.value.id); records.value = await store.getAll(); deleting.value = null } }
const currency = (value: number) => formatCurrency(value, settings.currency)

const allFilteredSelected = computed(() => filtered.value.length > 0 && filtered.value.every((item) => selected.value.has(item.id)))
function toggleSelectAll() {
  if (allFilteredSelected.value) {
    filtered.value.forEach((item) => selected.value.delete(item.id))
  } else {
    filtered.value.forEach((item) => selected.value.add(item.id))
  }
  selected.value = new Set(selected.value)
}
function toggleSelect(id: string) {
  if (selected.value.has(id)) selected.value.delete(id)
  else selected.value.add(id)
  selected.value = new Set(selected.value)
}
function clearSelection() { selected.value = new Set() }

async function confirmBulkDelete() {
  const ids = Array.from(selected.value)
  const count = await store.bulkRemove(ids)
  records.value = await store.getAll()
  clearSelection()
  bulkDeleteOpen.value = false
  toast.success(`${count} transaction${count === 1 ? '' : 's'} deleted.`)
}
async function confirmBulkCategorize() {
  const ids = Array.from(selected.value)
  const count = await store.bulkUpdateCategory(ids, bulkCategory.value)
  records.value = await store.getAll()
  clearSelection()
  bulkCategorizeOpen.value = false
  toast.success(`${count} transaction${count === 1 ? '' : 's'} moved to ${bulkCategory.value}.`)
  bulkCategory.value = ''
}
</script>

<template>
  <section>
    <div class="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p class="text-sm font-medium text-primary">Money movement</p><h1 class="mt-1 text-3xl font-bold">Transactions</h1><p class="mt-2 text-text-secondary">Search, sort, and manage every entry.</p></div><button class="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover" @click="router.push('/transactions/new')">+ Add transaction</button></div>
    <div class="rounded-2xl border border-border bg-surface p-5 shadow-card"><div class="grid gap-3 md:grid-cols-2 xl:grid-cols-6"><input v-model="filters.search" class="rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary xl:col-span-2" placeholder="Search description or category" /><select v-model="filters.type" class="rounded-lg border border-border px-3 py-2.5 text-sm"><option value="">All types</option><option>Income</option><option>Expense</option></select><select v-model="filters.category" class="rounded-lg border border-border px-3 py-2.5 text-sm"><option value="">All categories</option><option v-for="category in categoryStore.categories" :key="category.id">{{ category.name }}</option></select><input v-model="filters.start" type="date" class="rounded-lg border border-border px-3 py-2.5 text-sm" /><input v-model="filters.end" type="date" class="rounded-lg border border-border px-3 py-2.5 text-sm" /></div><div class="mt-3 flex flex-wrap items-center justify-between gap-3"><div class="flex gap-2"><select v-model="filters.sort" class="rounded-lg border border-border px-3 py-2 text-sm"><option value="date">Sort: Date</option><option value="amount">Sort: Amount</option><option value="category">Sort: Category</option></select><button class="rounded-lg border border-border px-3 py-2 text-sm font-semibold" @click="filters.direction = filters.direction === 'asc' ? 'desc' : 'asc'">{{ filters.direction === 'asc' ? '↑ Ascending' : '↓ Descending' }}</button></div><button class="text-sm font-semibold text-primary" @click="clearFilters">Clear filters</button></div></div>

    <div v-if="selected.size" class="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-primary/30 bg-indigo-50 p-4 dark:bg-slate-800">
      <span class="text-sm font-semibold text-primary">{{ selected.size }} selected</span>
      <div class="flex items-center gap-2">
        <select v-model="bulkCategory" class="rounded-lg border border-border bg-surface px-3 py-2 text-sm"><option value="">Move to category…</option><option v-for="category in categoryStore.categories" :key="category.id" :value="category.name">{{ category.name }}</option></select>
        <button :disabled="!bulkCategory" class="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50" @click="bulkCategorizeOpen = true">Apply</button>
      </div>
      <button class="rounded-lg bg-danger px-3 py-2 text-sm font-semibold text-white hover:bg-red-700" @click="bulkDeleteOpen = true">Delete selected</button>
      <button class="ml-auto text-sm font-semibold text-text-secondary hover:text-primary" @click="clearSelection">Clear selection</button>
    </div>

    <div v-if="loading" class="mt-6 space-y-3"><div v-for="number in 5" :key="number" class="h-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" /></div>
    <div v-else class="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-card"><div v-if="!filtered.length" class="p-12 text-center"><h2 class="font-bold">No transactions found</h2><p class="mt-2 text-sm text-text-secondary">Try clearing your filters or add a new transaction.</p></div><table v-else class="w-full text-left text-sm"><thead class="bg-surface-muted text-xs uppercase tracking-wide text-text-secondary"><tr><th class="w-10 px-5 py-4"><input type="checkbox" aria-label="Select all transactions" :checked="allFilteredSelected" @change="toggleSelectAll" /></th><th class="px-5 py-4">Description</th><th class="px-5 py-4">Category</th><th class="px-5 py-4">Date</th><th class="px-5 py-4">Amount</th><th class="px-5 py-4" /></tr></thead><tbody class="divide-y divide-border"><tr v-for="item in filtered" :key="item.id" class="hover:bg-surface-muted" :class="{ 'bg-indigo-50 dark:bg-slate-800': selected.has(item.id) }"><td class="px-5 py-4"><input type="checkbox" :checked="selected.has(item.id)" :aria-label="`Select ${item.description}`" @change="toggleSelect(item.id)" /></td><td class="px-5 py-4 font-semibold">{{ item.description }}<span class="mt-1 block text-xs font-normal text-text-secondary">{{ item.type }}<span v-if="item.notes" title="Has notes" class="ml-2">📝</span><span v-if="item.attachment" title="Has attachment" class="ml-1">📎</span></span></td><td class="px-5 py-4">{{ item.category }}</td><td class="px-5 py-4 text-text-secondary">{{ item.date }}</td><td :class="item.type === 'Income' ? 'text-success' : 'text-danger'" class="px-5 py-4 font-bold">{{ item.type === 'Income' ? '+' : '-' }}{{ currency(item.amount) }}</td><td class="px-5 py-4 text-right"><button class="mr-3 font-semibold text-primary" @click="router.push(`/transactions/${item.id}/edit`)">Edit</button><button class="font-semibold text-danger" @click="deleting = item">Delete</button></td></tr></tbody></table></div>
    <ConfirmDialog :open="Boolean(deleting)" title="Delete transaction?" message="This transaction will be permanently removed from your records." @cancel="deleting = null" @confirm="confirmDelete" />
    <ConfirmDialog :open="bulkDeleteOpen" title="Delete selected transactions?" :message="`${selected.size} transaction${selected.size === 1 ? '' : 's'} will be permanently removed from your records.`" @cancel="bulkDeleteOpen = false" @confirm="confirmBulkDelete" />
    <ConfirmDialog :open="bulkCategorizeOpen" title="Recategorize selected transactions?" :message="`${selected.size} transaction${selected.size === 1 ? '' : 's'} will be moved to ${bulkCategory}.`" confirm-label="Apply" @cancel="bulkCategorizeOpen = false" @confirm="confirmBulkCategorize" />
  </section>
</template>
