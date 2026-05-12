import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hpanel: {
          bg: '#101011',
          surface: '#18181a',
          'surface-2': '#1f1f23',
          border: '#222225',
          'border-strong': '#2c2c30',
          muted: '#9ca3af',
          'muted-strong': '#6b7280',
          primary: '#673de6',
          'primary-hover': '#7b66ff',
          'primary-soft': 'rgba(103, 61, 230, 0.15)',
          success: '#22c55e',
          'success-soft': 'rgba(34, 197, 94, 0.15)',
          warning: '#f59e0b',
          'warning-soft': 'rgba(245, 158, 11, 0.15)',
          danger: '#ef4444',
          'danger-soft': 'rgba(239, 68, 68, 0.15)',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
      },
      boxShadow: {
        card: '0 0 12px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 0 18px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config
