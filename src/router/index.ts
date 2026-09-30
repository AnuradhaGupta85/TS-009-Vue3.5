import { createRouter, createWebHistory } from 'vue-router'
import ShellLayout from '../layouts/ShellLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/',
      component: ShellLayout,
      children: [
        { path: 'dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
        { path: 'transactions', name: 'transactions', component: () => import('../views/TransactionsView.vue') },
        { path: 'transactions/new', name: 'transaction-new', component: () => import('../views/TransactionFormView.vue') },
        { path: 'transactions/:id/edit', name: 'transaction-edit', component: () => import('../views/TransactionFormView.vue') },
        { path: 'categories', name: 'categories', component: () => import('../views/CategoriesView.vue') },
        { path: 'monthly-summary', name: 'monthly-summary', component: () => import('../views/MonthlySummaryView.vue') },
        { path: 'savings-goals', name: 'savings-goals', component: () => import('../views/SavingsGoalsView.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
  ],
})

export default router
