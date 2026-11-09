/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dbe4fe',
          200: '#bfd0fd',
          300: '#93b1fc',
          400: '#608bf8',
          500: '#3b66f5',
          600: '#2547eb',
          700: '#1d35d8',
          800: '#1e2cb0',
          900: '#1e2a8a',
          950: '#171c54',
        },
        sudoku: {
          bg: '#f8fafc',
          card: '#ffffff',
          darkBg: '#0f172a',
          darkCard: '#1e293b',
          given: '#0f172a',
          user: '#2563eb',
          highlight: '#e0e7ff',
          darkHighlight: '#312e81',
          selected: '#fde047',
          darkSelected: '#854d0e',
          conflict: '#fee2e2',
          darkConflict: '#7f1d1d',
        }
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flashLine: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(59, 130, 246, 0.35)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        }
      },
      animation: {
        pop: 'pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        flashLine: 'flashLine 0.6s ease-in-out',
        shake: 'shake 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
}
