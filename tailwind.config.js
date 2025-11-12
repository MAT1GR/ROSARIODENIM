/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blanco-hueso": "#ffffff",
        arena: "#D3CFC3",
        caramelo: "#B5651D",
        "gris-oscuro": "#41403E",

        "brand-bg": "#ffffff",
        "brand-primary-text": "#41403E",
        "brand-secondary-text": "#41403E",
        "brand-accent": "#B5651D",
        "brand-light": "#ffffff",
        "brand-border": "#D3CFC3",
        "brand-primary": "#000000",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
