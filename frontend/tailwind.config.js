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
          dark: '#031710',
          forest: '#06261c',
          card: '#0a3225',
          border: '#15523f',
          surface: '#0d3d2e',
          emerald: '#00e575',
          jade: '#10b981',
          mint: '#34d399',
          gold: '#f59e0b',
          amber: '#fbbf24',
          cyan: '#06b6d4',
          rose: '#f43f5e',
          cream: '#f8fafc',
        },
        agri: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        slate: {
          850: '#0b2019',
          900: '#061c15',
          925: '#04150f',
          950: '#02100b',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(0, 229, 117, 0.35)',
        'glow-md': '0 0 25px rgba(0, 229, 117, 0.45)',
        'glow-lg': '0 0 40px rgba(0, 229, 117, 0.6)',
        'glow-gold': '0 0 25px rgba(245, 158, 11, 0.45)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.45)',
        'glow-rose': '0 0 25px rgba(244, 63, 94, 0.45)',
        'canva-card': '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(52, 211, 153, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-up': 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 229, 117, 0.3)' },
          '50%': { boxShadow: '0 0 35px rgba(0, 229, 117, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
