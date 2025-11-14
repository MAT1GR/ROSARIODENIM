// postcss.config.js

// LA CORRECCIÓN: Importamos desde '@tailwindcss/postcss'
import tailwindcss from '@tailwindcss/postcss'; 
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss({
      // Tu configuración de Tailwind v4 va aquí
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
      theme: {
        // NOTA: Ya no se usa 'extend' en v4, va directo
        colors: {
          blancoHueso: "#ffffff",
          arena: "#D3CFC3",
          caramelo: "#B5651D",
          grisoscuro: "#41403E", // <-- Aquí está tu color
          
          brandBg: "#ffffff",
          brandPrimaryText: "#41403E",
          brandSecondaryText: "#41403E",
          brandAccent: "#B5651D",
          brandLight: "#ffffff",
          brandBorder: "#D3CFC3",
          brandPrimary: "#000000",
        },
        fontFamily: {
          roboto: ["Roboto", "sans-serif"],
          poppins: ["Poppins", "sans-serif"],
          inter: ["Inter", "sans-serif"],
        },
      },
    }),
    autoprefixer,
  ],
};