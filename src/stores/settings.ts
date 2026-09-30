import { ref } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_CURRENCY } from '../utils/currency'

const CURRENCY_KEY = 'expense_tracker_currency'
const THEME_KEY = 'expense_tracker_theme'

function getInitialTheme(): boolean {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved) return saved === 'dark'
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false
}

export const useSettingsStore = defineStore('settings', () => {
  const currency = ref(localStorage.getItem(CURRENCY_KEY) || DEFAULT_CURRENCY)
  const isDark = ref(getInitialTheme())

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
  }
  applyTheme()

  function setCurrency(code: string) {
    currency.value = code
    localStorage.setItem(CURRENCY_KEY, code)
  }

  function toggleDark() {
    isDark.value = !isDark.value
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  return { currency, isDark, setCurrency, toggleDark }
})
