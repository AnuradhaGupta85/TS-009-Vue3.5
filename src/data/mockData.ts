// MOCK DATA — placeholder records for local development only.
// Replace with real API data before production use.

import type { Category, SavingsGoal, Transaction } from '../types'

export const mockCategories: Category[] = [
  { id: 'cat-food', name: 'Food', type: 'predefined' },
  { id: 'cat-travel', name: 'Travel', type: 'predefined' },
  { id: 'cat-shopping', name: 'Shopping', type: 'predefined' },
  { id: 'cat-bills', name: 'Bills', type: 'predefined' },
  { id: 'cat-health', name: 'Health', type: 'predefined' },
  { id: 'cat-entertainment', name: 'Entertainment', type: 'predefined' },
  { id: 'cat-other', name: 'Other', type: 'predefined' },
  { id: 'cat-custom-gifts', name: 'Gifts', type: 'custom' },
]

export const mockTransactions: Transaction[] = [
  { id: 'txn-1', amount: 4200, type: 'Income', category: 'Salary', date: '2025-03-01', description: 'March salary', createdAt: '2025-03-01T09:00:00.000Z' },
  { id: 'txn-2', amount: 64.5, type: 'Expense', category: 'Food', date: '2025-03-18', description: 'Weekly groceries', createdAt: '2025-03-18T18:00:00.000Z' },
  { id: 'txn-3', amount: 125, type: 'Expense', category: 'Bills', date: '2025-03-15', description: 'Internet bill', createdAt: '2025-03-15T10:00:00.000Z' },
  { id: 'txn-4', amount: 28, type: 'Expense', category: 'Travel', date: '2025-03-12', description: 'Metro pass', createdAt: '2025-03-12T08:00:00.000Z' },
  { id: 'txn-5', amount: 300, type: 'Income', category: 'Freelance', date: '2025-02-27', description: 'Design project', createdAt: '2025-02-27T14:00:00.000Z' },
  { id: 'txn-6', amount: 42, type: 'Expense', category: 'Entertainment', date: '2025-02-25', description: 'Concert tickets', createdAt: '2025-02-25T19:00:00.000Z' },
  { id: 'txn-7', amount: 89.99, type: 'Expense', category: 'Shopping', date: '2025-02-21', description: 'Running shoes', createdAt: '2025-02-21T12:00:00.000Z' },
  { id: 'txn-8', amount: 18.75, type: 'Expense', category: 'Food', date: '2025-02-19', description: 'Lunch with team', createdAt: '2025-02-19T13:00:00.000Z' },
  { id: 'txn-9', amount: 500, type: 'Income', category: 'Savings', date: '2025-02-15', description: 'Interest payment', createdAt: '2025-02-15T09:00:00.000Z' },
  { id: 'txn-10', amount: 55, type: 'Expense', category: 'Health', date: '2025-02-10', description: 'Pharmacy', createdAt: '2025-02-10T16:00:00.000Z' },
]

// MOCK: starter savings goals shown before the user creates their own.
export const mockSavingsGoals: SavingsGoal[] = [
  { id: 'goal-emergency', name: 'Emergency fund', targetAmount: 5000, currentAmount: 1800, targetDate: '2025-12-31', createdAt: '2025-01-05T09:00:00.000Z' },
  { id: 'goal-vacation', name: 'Vacation to Portugal', targetAmount: 2200, currentAmount: 950, targetDate: '2025-08-01', createdAt: '2025-02-01T09:00:00.000Z' },
]
