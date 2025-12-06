/** @type {import('tailwindcss').Config} */
export default {
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
        // Primary Background: Pure White (#FFFFFF) - Rely on bg-white utility, but define for clarity if needed.
        'primary-bg': '#FFFFFF',
        // Primary Text: Jet Black (#343A40)
        'primary-text': '#343A40',
        // CTA Elements: Deep Crimson (#D81E27)
        'cta': '#D81E27',
        // Secondary Accents: Subtle Ash Gray (Defining a light gray, e.g., #F1F1F1)
        'secondary-accent': '#F1F1F1',
        // Primary Highlights/Borders: Platinum (#E5E5E5)
        'primary-border': '#E5E5E5',
        // Hover/Focus States: Dark Charcoal (#585858)
        'hover-focus': '#585858',
        'beige-100': '#F5F5DC', // Light Beige
      },
    },
  },
  plugins: [],
}