/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Paleta de colores inspirada en la referencia
      colors: {
        'brand-pink': '#D8A7B1', // Mantenemos el rosa para acentos clave
        'brand-primary': '#111111', // Negro para texto principal
        'brand-secondary': '#666666', // Gris para texto secundario
        'brand-accent': '#A79C9A', // El color topo/rosa pálido de los botones
        'brand-accent-hover': '#968b89',
        'brand-light': '#F5F5F5', // Gris muy claro para fondos y bordes
        'brand-bg': '#FFFFFF',
        'brand-outline': '#E5E5E5',
      },
      fontFamily: {
        // Fuente limpia y moderna para toda la interfaz
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
