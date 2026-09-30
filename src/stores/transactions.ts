import { ref } from 'vue'
import { defineStore } from 'pinia'
import { mockTransactions } from '../data/mockData'
import { api } from '../services/api'
import type { Transaction, TransactionInput } from '../types'

const STORAGE_KEY = 'expense_tracker_transactions'
// TODO(USE_MOCK): verify path + response shape against the real backend's OpenAPI schema before flipping this to false.
const USE_MOCK = true

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([])

  function load(): Transaction[] {
    const saved = localStorage.getItem(STORAGE_KEY)
    const records = saved ? JSON.parse(saved) as Transaction[] : mockTransactions
    if (!saved) localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    transactions.value = records
    return records
  }

  function save(records: Transaction[]) {
    transactions.value = records
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }

  // MOCK: returns the locally persisted transaction collection in place of an API list response.
  function localGetAll(): Transaction[] { return load() }
  // MOCK: resolves a locally persisted transaction in place of an API detail response.
  function localGetById(id: string): Transaction | undefined { return load().find((record) => record.id === id) }
  // MOCK: creates a locally persisted transaction in place of an API create response.
  function localCreate(input: TransactionInput): Transaction {
    const record = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    save([record, ...load()])
    return record
  }
  // MOCK: updates a locally persisted transaction in place of an API update response.
  function localUpdate(id: string, input: TransactionInput): Transaction | undefined {
    const record = localGetById(id)
    if (!record) return undefined
    const updated = { ...record, ...input }
    save(load().map((item) => item.id === id ? updated : item))
    return updated
  }
  // MOCK: deletes a locally persisted transaction in place of an API delete response.
  function localDelete(id: string): boolean {
    const current = load()
    if (!current.some((record) => record.id === id)) return false
    save(current.filter((record) => record.id !== id))
    return true
  }

  async function getAll(): Promise<Transaction[]> {
    if (USE_MOCK) return localGetAll()
    return (await api.get<Transaction[]>('/api/v1/transactions')).data
  }
  async function getById(id: string): Promise<Transaction | undefined> {
    if (USE_MOCK) return localGetById(id)
    return (await api.get<Transaction>(`/api/v1/transactions/${id}`)).data
  }
  async function create(input: TransactionInput): Promise<Transaction> {
    if (USE_MOCK) return localCreate(input)
    return (await api.post<Transaction>('/api/v1/transactions', input)).data
  }
  async function update(id: string, input: TransactionInput): Promise<Transaction | undefined> {
    if (USE_MOCK) return localUpdate(id, input)
    return (await api.put<Transaction>(`/api/v1/transactions/${id}`, input)).data
  }
  async function remove(id: string): Promise<boolean> {
    if (USE_MOCK) return localDelete(id)
    await api.delete<void>(`/api/v1/transactions/${id}`)
    return true
  }

  return { transactions, getAll, getById, create, update, remove }
})
