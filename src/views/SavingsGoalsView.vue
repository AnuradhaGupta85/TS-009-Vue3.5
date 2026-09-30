<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { useSavingsGoalStore } from '../stores/savingsGoals'
import { useSettingsStore } from '../stores/settings'
import type { SavingsGoal } from '../types'
import { formatCurrency } from '../utils/currency'

const store = useSavingsGoalStore()
const settings = useSettingsStore()
const toast = useToast()
const loading = ref(true)
const form = reactive({ name: '', targetAmount: '', targetDate: '' })
const errors = reactive<Record<string, string>>({})
const touched = reactive<Record<string, boolean>>({})
const goalToDelete = ref<SavingsGoal | null>(null)
const contributingGoal = ref<SavingsGoal | null>(null)
const contributionAmount = ref('')

onMounted(async () => { await store.getAll(); loading.value = false })

const currency = (value: number) => formatCurrency(value, settings.currency)
function progress(goal: SavingsGoal) { return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) }

const isValid = computed(() => form.name.trim().length >= 2 && Number(form.targetAmount) > 0 && Boolean(form.targetDate))
function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (form.name.trim().length < 2) errors.name = 'Enter at least 2 characters.'
  if (!Number(form.targetAmount) || Number(form.targetAmount) <= 0) errors.targetAmount = 'Enter a positive target amount.'
  if (!form.targetDate) errors.targetDate = 'Select a target date.'
  return Object.keys(errors).length === 0
}
async function addGoal() {
  Object.keys(touched).forEach((key) => touched[key] = true)
  if (!validate()) return
  await store.create({ name: form.name.trim(), targetAmount: Number(form.targetAmount), targetDate: form.targetDate })
  Object.assign(form, { name: '', targetAmount: '', targetDate: '' })
  Object.keys(touched).forEach((key) => touched[key] = false)
  toast.success('Savings goal created.')
}

function openContribute(goal: SavingsGoal) { contributingGoal.value = goal; contributionAmount.value = '' }
async function confirmContribute() {
  if (!contributingGoal.value || !Number(contributionAmount.value)) return
  await store.contribute(contributingGoal.value.id, Number(contributionAmount.value))
  toast.success('Contribution added to your goal.')
  contributingGoal.value = null
  contributionAmount.value = ''
}
async function confirmDeleteGoal() {
  if (goalToDelete.value) {
    await store.remove(goalToDelete.value.id)
    toast.success('Savings goal deleted.')
    goalToDelete.value = null
  }
}
</script>

<template>
  <section>
    <div class="mb-7"><p class="text-sm font-medium text-primary">Plan ahead</p><h1 class="mt-1 text-3xl font-bold">Savings goals</h1><p class="mt-2 text-text-secondary">Set targets and track your progress toward them.</p></div>

    <div v-if="loading" class="grid gap-6 lg:grid-cols-2"><div v-for="number in 2" :key="number" class="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" /></div>
    <div v-else class="grid gap-6 lg:grid-cols-2">
      <article class="rounded-2xl border border-border bg-surface p-6 shadow-card lg:col-span-2">
        <h2 class="text-lg font-bold">Create a new goal</h2>
        <form class="mt-5 grid gap-4 sm:grid-cols-3" @submit.prevent="addGoal">
          <label class="text-sm font-semibold sm:col-span-1">Goal name<input v-model="form.name" maxlength="60" class="mt-2 block w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-primary" placeholder="e.g. New laptop" @blur="touched.name = true; validate()" /><span v-if="touched.name && errors.name" class="mt-1 block font-normal text-danger">{{ errors.name }}</span></label>
          <label class="text-sm font-semibold">Target amount<input v-model="form.targetAmount" type="number" min="1" step="0.01" class="mt-2 block w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-primary" @blur="touched.targetAmount = true; validate()" /><span v-if="touched.targetAmount && errors.targetAmount" class="mt-1 block font-normal text-danger">{{ errors.targetAmount }}</span></label>
          <label class="text-sm font-semibold">Target date<input v-model="form.targetDate" type="date" class="mt-2 block w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-primary" @blur="touched.targetDate = true; validate()" /><span v-if="touched.targetDate && errors.targetDate" class="mt-1 block font-normal text-danger">{{ errors.targetDate }}</span></label>
          <div class="sm:col-span-3"><button type="submit" :disabled="!isValid" class="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Add goal</button></div>
        </form>
      </article>

      <div v-if="!store.goals.length" class="lg:col-span-2 rounded-2xl border border-dashed border-border bg-surface p-12 text-center"><h2 class="text-lg font-bold">No savings goals yet</h2><p class="mt-2 text-text-secondary">Create your first goal above to start tracking progress.</p></div>
      <article v-for="goal in store.goals" :key="goal.id" class="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <div class="flex items-start justify-between gap-3"><div><h3 class="text-lg font-bold">{{ goal.name }}</h3><p class="mt-1 text-sm text-text-secondary">Target date: {{ goal.targetDate }}</p></div><button class="text-sm font-semibold text-danger" @click="goalToDelete = goal">Delete</button></div>
        <div class="mt-5"><div class="mb-2 flex justify-between text-sm"><span class="font-medium">{{ currency(goal.currentAmount) }} of {{ currency(goal.targetAmount) }}</span><span class="text-text-secondary">{{ progress(goal) }}%</span></div><div class="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div class="h-full rounded-full bg-primary" :style="{ width: `${progress(goal)}%` }" /></div></div>
        <button class="mt-5 rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-indigo-50 dark:hover:bg-slate-800" @click="openContribute(goal)">Add contribution</button>
      </article>
    </div>

    <div v-if="contributingGoal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true">
      <div class="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl">
        <h2 class="text-lg font-bold">Add contribution to {{ contributingGoal.name }}</h2>
        <label class="mt-4 block text-sm font-semibold">Amount<input v-model="contributionAmount" type="number" min="0.01" step="0.01" class="mt-2 block w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-primary" autofocus /></label>
        <div class="mt-6 flex justify-end gap-3"><button class="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-surface-muted" @click="contributingGoal = null">Cancel</button><button :disabled="!Number(contributionAmount)" class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" @click="confirmContribute">Add</button></div>
      </div>
    </div>

    <ConfirmDialog :open="Boolean(goalToDelete)" title="Delete savings goal?" message="This goal and its progress will be permanently removed." @cancel="goalToDelete = null" @confirm="confirmDeleteGoal" />
  </section>
</template>
