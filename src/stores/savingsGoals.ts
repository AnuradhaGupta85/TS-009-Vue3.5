import { ref } from 'vue'
import { defineStore } from 'pinia'
import { mockSavingsGoals } from '../data/mockData'
import { api } from '../services/api'
import type { SavingsGoal, SavingsGoalInput } from '../types'

const STORAGE_KEY = 'expense_tracker_savings_goals'
// TODO(USE_MOCK): verify path + response shape against the real backend's OpenAPI schema before flipping this to false.
const USE_MOCK = true

export const useSavingsGoalStore = defineStore('savingsGoals', () => {
  const goals = ref<SavingsGoal[]>([])

  function load(): SavingsGoal[] {
    const saved = localStorage.getItem(STORAGE_KEY)
    const records = saved ? JSON.parse(saved) as SavingsGoal[] : mockSavingsGoals
    if (!saved) localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    goals.value = records
    return records
  }

  function save(records: SavingsGoal[]) {
    goals.value = records
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }

  // MOCK: returns locally persisted savings goals in place of an API list response.
  function localGetAll(): SavingsGoal[] { return load() }
  // MOCK: creates a locally persisted savings goal in place of an API create response.
  function localCreate(input: SavingsGoalInput): SavingsGoal {
    const record: SavingsGoal = { id: crypto.randomUUID(), name: input.name.trim(), targetAmount: input.targetAmount, currentAmount: 0, targetDate: input.targetDate, createdAt: new Date().toISOString() }
    save([record, ...load()])
    return record
  }
  // MOCK: adds a contribution to a locally persisted savings goal in place of an API update response.
  function localContribute(id: string, amount: number): SavingsGoal | undefined {
    const current = load()
    const record = current.find((item) => item.id === id)
    if (!record) return undefined
    const updated = { ...record, currentAmount: Math.max(0, record.currentAmount + amount) }
    save(current.map((item) => item.id === id ? updated : item))
    return updated
  }
  // MOCK: deletes a locally persisted savings goal in place of an API delete response.
  function localDelete(id: string): boolean {
    const current = load()
    if (!current.some((record) => record.id === id)) return false
    save(current.filter((record) => record.id !== id))
    return true
  }

  async function getAll(): Promise<SavingsGoal[]> {
    if (USE_MOCK) return localGetAll()
    return (await api.get<SavingsGoal[]>('/api/v1/savings-goals')).data
  }
  async function create(input: SavingsGoalInput): Promise<SavingsGoal> {
    if (USE_MOCK) return localCreate(input)
    return (await api.post<SavingsGoal>('/api/v1/savings-goals', input)).data
  }
  async function contribute(id: string, amount: number): Promise<SavingsGoal | undefined> {
    if (USE_MOCK) return localContribute(id, amount)
    return (await api.put<SavingsGoal>(`/api/v1/savings-goals/${id}/contribute`, { amount })).data
  }
  async function remove(id: string): Promise<boolean> {
    if (USE_MOCK) return localDelete(id)
    await api.delete<void>(`/api/v1/savings-goals/${id}`)
    return true
  }

  return { goals, getAll, create, contribute, remove }
})
