import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { test } from 'vitest'
import TransactionFormView from './TransactionFormView.vue'

test('renders without crashing', () => {
  const router = createRouter({ history: createMemoryHistory(), routes: [] })
  mount(TransactionFormView, { global: { plugins: [createPinia(), router] } })
})
