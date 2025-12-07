/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
      colors: {
        // Light theme colors
        'primary-bg': '#FFFFFF',
        'primary-text': '#343A40',
        'cta': '#D81E27',
        'secondary-accent': '#F1F1F1',
        'primary-border': '#E5E5E5',
        'hover-focus': '#585858',
        'beige-100': '#F5F5DC',

        // Dark theme colors (mirror palette)
        dark: {
          'primary-bg': '#0f172a',      // slate-900 background
          'primary-text': '#f1f5f9',    // slate-100 text
          'cta': '#dc2626',             // red-600 (keep brand color visible)
          'secondary-accent': '#334155', // slate-700
          'primary-border': '#475569',   // slate-600
          'hover-focus': '#94a3b8',      // slate-400
        },
      },
    },
  },
  plugins: [],
}