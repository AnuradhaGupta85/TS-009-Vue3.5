import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { test } from 'vitest'
import CategoriesView from './CategoriesView.vue'

test('renders without crashing', () => {
  const router = createRouter({ history: createMemoryHistory(), routes: [] })
  mount(CategoriesView, { global: { plugins: [createPinia(), router] } })
})
