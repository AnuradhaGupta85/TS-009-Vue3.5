export type TransactionType = 'Income' | 'Expense'

export interface TransactionAttachment {
  name: string
  dataUrl: string
}

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  category: string
  date: string
  description: string
  notes?: string
  attachment?: TransactionAttachment
  createdAt: string
}

export interface TransactionInput {
  amount: number
  type: TransactionType
  category: string
  date: string
  description: string
  notes?: string
  attachment?: TransactionAttachment
}

export interface Category {
  id: string
  name: string
  type: 'predefined' | 'custom'
}

export interface CategoryInput {
  name: string
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  createdAt: string
}

export interface SavingsGoalInput {
  name: string
  targetAmount: number
  targetDate: string
}
