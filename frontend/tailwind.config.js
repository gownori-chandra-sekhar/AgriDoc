/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        canva: {
          bg: '#f4f9f5',
          surface: '#ffffff',
          panel: '#ffffff',
          card: '#ffffff',
          border: '#e2ece4',
          'border-hover': '#10b981',
          emerald: '#059669',
          'emerald-light': '#ecfdf5',
          'emerald-dark': '#064e3b',
          jade: '#10b981',
          mint: '#34d399',
          gold: '#d97706',
          'gold-light': '#fef3c7',
          amber: '#f59e0b',
          cyan: '#0284c7',
          'cyan-light': '#e0f2fe',
          rose: '#e11d48',
          'rose-light': '#ffe4e6',
          text: '#0f172a',
          'text-muted': '#64748b',
        },
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      boxShadow: {
        'canva-card': '0 10px 25px -5px rgba(5, 150, 105, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'canva-hover': '0 20px 30px -10px rgba(5, 150, 105, 0.15), 0 8px 12px -4px rgba(0, 0, 0, 0.05)',
        'glow-sm': '0 4px 14px rgba(5, 150, 105, 0.25)',
        'glow-md': '0 6px 20px rgba(5, 150, 105, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'scale-up': 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
