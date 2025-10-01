/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Paleta de colores extraída de la nueva captura
      colors: {
        'brand-primary-text': '#5a5a5a',    // Para títulos y precios
        'brand-secondary-text': '#a8a8a8', // Para breadcrumbs y texto secundario
        'brand-button-bg': '#000000',      // Fondo de botones activos (AHORA NEGRO)
        'brand-button-bg-hover': '#333333',// Hover para los botones (AHORA GRIS OSCURO)
        'brand-border': '#d1d1d1',        // Bordes de elementos inactivos
        'brand-pink': '#000000',           // Rosa erradicado, ahora es negro para elementos de acción
        'brand-pink-dark': '#333333',      // Sombra de negro para degradados/hovers
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