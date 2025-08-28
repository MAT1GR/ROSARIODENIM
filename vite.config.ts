import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Esta sección es clave para la comunicación Frontend <-> Backend
  server: {
    proxy: {
      // Cualquier petición que empiece con '/api' será redirigida
      '/api': {
        target: 'http://localhost:3001', // El servidor backend
        changeOrigin: true, // Necesario para evitar errores de CORS
        secure: false,      // No necesitamos HTTPS en desarrollo
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});