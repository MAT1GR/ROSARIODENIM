/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // TUS COLORES, AHORA EN camelCase
    colors: {
      blancoHueso: "#ffffff", // Cambiado de "blanco-hueso"
      arena: "#D3CFC3",
      caramelo: "#B5651D",
      grisOscuro: "#41403E", // Cambiado de "gris-oscuro"

      brandBg: "#ffffff", // Cambiado
      brandPrimaryText: "#41403E", // Cambiado
      brandSecondaryText: "#41403E", // Cambiado
      brandAccent: "#B5651D", // Cambiado
      brandLight: "#ffffff", // Cambiado
      brandBorder: "#D3CFC3", // Cambiado
      brandPrimary: "#000000", // Cambiado
      
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};