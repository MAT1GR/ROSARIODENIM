/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary-text": "#2c2c2c",
        "brand-secondary-text": "#5a5a5a",
        "brand-primary": "#000000",
        "brand-secondary": "#1a1a1a",
        "brand-border": "#d1d1d1",
        "brand-light": "#F5F5F5",
        "brand-bg": "#FFFFFF",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
