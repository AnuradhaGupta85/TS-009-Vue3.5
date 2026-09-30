/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        'primary-hover': '#4338ca',
        surface: '#ffffff',
        'surface-muted': '#f8fafc',
        background: '#f5f7fb',
        'text-primary': '#172033',
        'text-secondary': '#64748b',
        border: '#e2e8f0',
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#d97706',
        info: '#0284c7',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
}
