/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary-text': '#333333',
        'brand-secondary-text': '#757575',
        'brand-button-bg': '#000000',
        'brand-button-bg-hover': '#333333',
        'brand-border': '#e0e0e0',
        'brand-pink': '#000000',
        'brand-pink-dark': '#333333',
        'brand-light': '#f5f5f5',
        'brand-bg': '#FFFFFF',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}