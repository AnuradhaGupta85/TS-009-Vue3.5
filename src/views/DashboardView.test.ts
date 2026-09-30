import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { test } from 'vitest'
import DashboardView from './DashboardView.vue'

test('renders without crashing', () => {
  const router = createRouter({ history: createMemoryHistory(), routes: [] })
  mount(DashboardView, { global: { plugins: [createPinia(), router] } })
})
