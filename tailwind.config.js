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
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
      },
      // Typography Scale
      fontSize: {
        'heading-xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-l': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-m': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-s': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-large': ['1.125rem', { lineHeight: '1.6' }],
        'body-small': ['0.875rem', { lineHeight: '1.5' }],
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.025em', fontWeight: '500' }],
      },
      // Spacing Scale
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
      },
      // Max Width for Form Pages
      maxWidth: {
        'form': '50rem',  // 800px
      },
      // Enhanced Box Shadows
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'elevated': '0 8px 20px rgba(0, 0, 0, 0.12)',
        'premium': '0 12px 28px rgba(0, 0, 0, 0.15)',
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