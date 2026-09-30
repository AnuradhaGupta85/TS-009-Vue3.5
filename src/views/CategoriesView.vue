<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { useCategoryStore } from '../stores/categories'
import { useTransactionStore } from '../stores/transactions'
import type { Category } from '../types'

const categoryStore = useCategoryStore()
const transactionStore = useTransactionStore()
const toast = useToast()
const loading = ref(true)
const form = reactive({ name: '' })
const errors = reactive<Record<string, string>>({})
const touched = ref(false)
const categoryToDelete = ref<Category | null>(null)
onMounted(async () => { await categoryStore.getAll(); await transactionStore.getAll(); loading.value = false })
const predefined = computed(() => categoryStore.categories.filter((item) => item.type === 'predefined'))
const custom = computed(() => categoryStore.categories.filter((item) => item.type === 'custom'))
const isValid = computed(() => form.name.trim().length >= 2)
function validate() { errors.name = form.name.trim().length < 2 ? 'Enter at least 2 characters.' : ''; return !errors.name }
async function addCategory() { touched.value = true; if (!validate()) return; if (categoryStore.categories.some((item) => item.name.toLowerCase() === form.name.trim().toLowerCase())) { errors.name = 'That category already exists.'; return }; await categoryStore.create({ name: form.name }); form.name = ''; toast.success('Custom category added.') }
function requestDelete(category: Category) { if (transactionStore.transactions.some((item) => item.category === category.name)) { toast.error('This category is in use and cannot be deleted.'); return }; categoryToDelete.value = category }
async function confirmDelete() { if (categoryToDelete.value) { await categoryStore.remove(categoryToDelete.value.id); toast.success('Custom category deleted.'); categoryToDelete.value = null } }
</script>

<template>
  <section><div class="mb-7"><p class="text-sm font-medium text-primary">Organize spending</p><h1 class="mt-1 text-3xl font-bold">Categories</h1><p class="mt-2 text-text-secondary">Create custom categories for a clearer picture of your expenses.</p></div><div v-if="loading" class="grid gap-6 lg:grid-cols-2"><div v-for="number in 2" :key="number" class="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" /></div><div v-else class="grid gap-6 lg:grid-cols-2"><article class="rounded-2xl border border-border bg-surface p-6 shadow-card"><h2 class="text-lg font-bold">Predefined categories</h2><p class="mt-1 text-sm text-text-secondary">Available to every expense entry.</p><div class="mt-6 flex flex-wrap gap-3"><span v-for="category in predefined" :key="category.id" class="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-primary">{{ category.name }}</span></div></article><article class="rounded-2xl border border-border bg-surface p-6 shadow-card"><h2 class="text-lg font-bold">Custom categories</h2><form class="mt-5 flex gap-3" @submit.prevent="addCategory"><input v-model="form.name" maxlength="40" class="min-w-0 flex-1 rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" placeholder="e.g. Pets" @blur="touched = true; validate()" /><button type="submit" :disabled="!isValid" class="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Add</button></form><p v-if="touched && errors.name" class="mt-2 text-sm text-danger">{{ errors.name }}</p><p v-else class="mt-2 text-xs text-text-secondary">At least 2 characters. Custom categories persist on this device.</p><div v-if="custom.length" class="mt-5 divide-y divide-border"><div v-for="category in custom" :key="category.id" class="flex items-center justify-between py-3"><span class="font-medium">{{ category.name }}</span><button class="text-sm font-semibold text-danger" @click="requestDelete(category)">Delete</button></div></div><p v-else class="mt-6 rounded-xl bg-surface-muted p-4 text-sm text-text-secondary">No custom categories yet — create one above.</p></article></div><ConfirmDialog :open="Boolean(categoryToDelete)" title="Delete custom category?" message="The category will be permanently removed." @cancel="categoryToDelete = null" @confirm="confirmDelete" /></section>
</template>
