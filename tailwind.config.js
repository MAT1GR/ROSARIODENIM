/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Paleta de colores extraída de la nueva captura
      colors: {
        'brand-primary-text': '#5a5a5a',    // Para títulos y precios
        'brand-secondary-text': '#a8a8a8', // Para breadcrumbs y texto secundario
        'brand-button-bg': '#c4b7b5',      // Fondo de botones activos
        'brand-button-bg-hover': '#b8a9a7',// Hover para los botones
        'brand-border': '#d1d1d1',        // Bordes de elementos inactivos
        'brand-pink': '#D8A7B1',           // Mantenemos el rosa para el botón "Comprar"
        'brand-pink-dark': '#c69ba5',      // Nuevo color para el degradado
        'brand-light': '#F5F5F5',
        'brand-bg': '#FFFFFF',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};