export interface SupportedCurrency {
  code: string
  label: string
}

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'GBP', label: 'British Pound (£)' },
  { code: 'INR', label: 'Indian Rupee (₹)' },
  { code: 'JPY', label: 'Japanese Yen (¥)' },
]

export const DEFAULT_CURRENCY = 'USD'

/**
 * Centralized currency formatter used across the app so every view renders
 * amounts consistently and respects the user's chosen currency.
 */
export function formatCurrency(value: number, currency: string = DEFAULT_CURRENCY): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value)
  } catch {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: DEFAULT_CURRENCY }).format(value)
  }
}
