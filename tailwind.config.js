/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Nueva paleta de colores
        "blanco-hueso": "#ffffffff",
        arena: "#D3CFC3",
        caramelo: "#B5651D",
        "gris-oscuro": "#41403E",

        // Mapeo a los nombres de tema existentes para una actualización global
        "brand-bg": "#F7F5F2",
        "brand-primary-text": "#41403E",
        "brand-secondary-text": "#41403E", // Se usa gris oscuro para legibilidad
        "brand-accent": "#B5651D",
        "brand-light": "#F7F5F2",
        "brand-border": "#D3CFC3", // Arena para bordes
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
