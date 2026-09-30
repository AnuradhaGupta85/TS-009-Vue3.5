import { ref } from 'vue'
import { defineStore } from 'pinia'
import { mockCategories } from '../data/mockData'
import { api } from '../services/api'
import type { Category, CategoryInput } from '../types'

const STORAGE_KEY = 'expense_tracker_categories'
// TODO(USE_MOCK): verify path + response shape against the real backend's OpenAPI schema before flipping this to false.
const USE_MOCK = true

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])

  function load(): Category[] {
    const saved = localStorage.getItem(STORAGE_KEY)
    const records = saved ? JSON.parse(saved) as Category[] : mockCategories
    if (!saved) localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    categories.value = records
    return records
  }

  function save(records: Category[]) {
    categories.value = records
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }

  // MOCK: returns locally persisted categories in place of an API list response.
  function localGetAll(): Category[] { return load() }
  // MOCK: creates a locally persisted custom category in place of an API create response.
  function localCreate(input: CategoryInput): Category {
    const record = { id: crypto.randomUUID(), name: input.name.trim(), type: 'custom' as const }
    save([...load(), record])
    return record
  }
  // MOCK: deletes a locally persisted category in place of an API delete response.
  function localDelete(id: string): boolean {
    const record = load().find((category) => category.id === id)
    if (!record || record.type !== 'custom') return false
    save(load().filter((category) => category.id !== id))
    return true
  }

  async function getAll(): Promise<Category[]> {
    if (USE_MOCK) return localGetAll()
    return (await api.get<Category[]>('/api/v1/categories')).data
  }
  async function create(input: CategoryInput): Promise<Category> {
    if (USE_MOCK) return localCreate(input)
    return (await api.post<Category>('/api/v1/categories', input)).data
  }
  async function remove(id: string): Promise<boolean> {
    if (USE_MOCK) return localDelete(id)
    await api.delete<void>(`/api/v1/categories/${id}`)
    return true
  }

  return { categories, getAll, create, remove }
})
