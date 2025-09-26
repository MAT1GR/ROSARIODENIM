/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-primary-text': '#5a5a5a',
        'brand-secondary-text': '#a8a8a8',
        'brand-button-bg': '#c4b7b5',
        'brand-button-bg-hover': '#b8a9a7',
        'brand-border': '#d1d1d1',
        'brand-pink': '#D8A7B1',
        'brand-pink-dark': '#c69ba5',
        'brand-light': '#F5F5F5',
        'brand-bg': '#FFFFFF',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};