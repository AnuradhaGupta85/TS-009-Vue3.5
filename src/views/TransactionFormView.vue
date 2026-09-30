<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { useCategoryStore } from '../stores/categories'
import { useTransactionStore } from '../stores/transactions'
import type { TransactionInput, TransactionType } from '../types'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const editingId = computed(() => route.params.id as string | undefined)
const loading = ref(true)
const deleteOpen = ref(false)
const errors = reactive<Record<string, string>>({})
const touched = reactive<Record<string, boolean>>({})
const form = reactive({ amount: '', type: 'Expense' as TransactionType, category: '', date: new Date().toISOString().slice(0, 10), description: '' })

onMounted(async () => {
  await categoryStore.getAll()
  if (editingId.value) {
    const record = await transactionStore.getById(editingId.value)
    if (!record) { router.replace('/transactions'); return }
    Object.assign(form, { amount: String(record.amount), type: record.type, category: record.category, date: record.date, description: record.description })
  }
  loading.value = false
})
const isValid = computed(() => Number(form.amount) > 0 && Boolean(form.type && form.category && form.date && form.description.trim()))
function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!Number(form.amount) || Number(form.amount) <= 0) errors.amount = 'Enter a positive amount.'
  if (!form.category) errors.category = 'Choose a category.'
  if (!form.date) errors.date = 'Select a date.'
  if (!form.description.trim()) errors.description = 'Enter a description.'
  return Object.keys(errors).length === 0
}
async function submit() {
  Object.keys(touched).forEach((key) => touched[key] = true)
  if (!validate()) return
  const input: TransactionInput = { amount: Number(form.amount), type: form.type, category: form.category, date: form.date, description: form.description.trim() }
  if (editingId.value) { await transactionStore.update(editingId.value, input); toast.success('Transaction updated successfully.') } else { await transactionStore.create(input); toast.success('Transaction added successfully.') }
  router.push('/transactions')
}
async function deleteRecord() { if (editingId.value) { await transactionStore.remove(editingId.value); toast.success('Transaction deleted.'); router.push('/transactions') } }
</script>

<template>
  <section class="mx-auto max-w-2xl"><button class="mb-5 text-sm font-semibold text-text-secondary hover:text-primary" @click="router.back()">← Back to transactions</button><div class="rounded-2xl border border-border bg-surface p-6 shadow-card md:p-8"><div class="mb-7"><p class="text-sm font-medium text-primary">{{ editingId ? 'Update entry' : 'New entry' }}</p><h1 class="mt-1 text-3xl font-bold">{{ editingId ? 'Edit transaction' : 'Add transaction' }}</h1></div><div v-if="loading" class="h-80 animate-pulse rounded-xl bg-slate-100" /><form v-else class="space-y-5" @submit.prevent="submit"><div><label class="mb-2 block text-sm font-semibold">Transaction type</label><div class="grid grid-cols-2 gap-3"><button v-for="type in ['Expense', 'Income']" :key="type" type="button" :class="form.type === type ? (type === 'Expense' ? 'border-danger bg-red-50 text-danger' : 'border-success bg-green-50 text-success') : 'border-border'" class="rounded-xl border px-4 py-3 text-sm font-semibold" @click="form.type = type as TransactionType">{{ type }}</button></div></div><div class="grid gap-5 sm:grid-cols-2"><label class="text-sm font-semibold">Amount<input v-model="form.amount" type="number" min="0.01" step="0.01" class="mt-2 block w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-primary" @blur="touched.amount = true; validate()" /><span v-if="touched.amount && errors.amount" class="mt-1 block font-normal text-danger">{{ errors.amount }}</span><span v-else class="mt-1 block font-normal text-text-secondary">Must be a positive number.</span></label><label class="text-sm font-semibold">Date<input v-model="form.date" type="date" class="mt-2 block w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-primary" @blur="touched.date = true; validate()" /><span v-if="touched.date && errors.date" class="mt-1 block font-normal text-danger">{{ errors.date }}</span></label></div><label class="block text-sm font-semibold">Category<select v-model="form.category" class="mt-2 block w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-primary" @blur="touched.category = true; validate()"><option value="">Select a category</option><option v-for="category in categoryStore.categories" :key="category.id" :value="category.name">{{ category.name }}</option><option v-if="form.type === 'Income'" value="Salary">Salary</option><option v-if="form.type === 'Income'" value="Freelance">Freelance</option></select><span v-if="touched.category && errors.category" class="mt-1 block font-normal text-danger">{{ errors.category }}</span></label><label class="block text-sm font-semibold">Description<input v-model="form.description" maxlength="120" class="mt-2 block w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-primary" placeholder="What was this for?" @blur="touched.description = true; validate()" /><span v-if="touched.description && errors.description" class="mt-1 block font-normal text-danger">{{ errors.description }}</span><span v-else class="mt-1 block font-normal text-text-secondary">Up to 120 characters.</span></label><div class="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6"><button v-if="editingId" type="button" class="text-sm font-semibold text-danger" @click="deleteOpen = true">Delete transaction</button><div class="ml-auto flex gap-3"><button type="button" class="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold" @click="router.push('/transactions')">Cancel</button><button type="submit" :disabled="!isValid" class="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{{ editingId ? 'Save changes' : 'Save transaction' }}</button></div></div></form></div><ConfirmDialog :open="deleteOpen" title="Delete transaction?" message="This action cannot be undone." @cancel="deleteOpen = false" @confirm="deleteRecord" /></section>
</template>
