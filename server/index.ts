// import 'dotenv/config'; // <-- COMENTADO
import express from 'express';
import cors from 'cors';
import path from 'path';

// --- Tus importaciones de rutas ---
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import customerRoutes from './routes/customers.js';
import settingsRoutes from './routes/settings.js';
import dashboardRoutes from './routes/dashboard.js';
import shippingRoutes from './routes/shipping.js';
import testimonialsRoutes from './routes/testimonials.js';
import notificationRoutes from './routes/notifications.js';
import paymentRoutes from './controllers/paymentController.js';

const app = express();

// --- Configuración de CORS ---
app.use(cors({ origin: 'https://denimrosario.com.ar' }));
app.use(express.json());

// --- SERVIR ARCHIVOS ESTÁTICOS (CORREGIDO) ---
const __dirname = process.cwd(); // __dirname es ~/backend

// 1. Servir el Frontend (React)
// COMENTADO: 'public_html' lo maneja.
// app.use(express.static(path.join(__dirname, '..')));

// 2. Servir las Imágenes (public/uploads)
// ¡CORREGIDO! Esto ahora busca la carpeta 'public' DENTRO de '~/backend'
app.use(express.static(path.join(__dirname, 'public')));


// --- Puerto de Producción ---
const PORT = process.env.PORT || 3001;

// --- API Routes (SIN EL PREFIJO /api) ---
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/customers', customerRoutes);
app.use('/settings', settingsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/shipping', shippingRoutes);
app.use('/testimonials', testimonialsRoutes);
app.use('/notifications', notificationRoutes);
app.use('/payments', paymentRoutes);

// --- "Catch-All" para React (CORREGIDO) ---
// COMENTADO: 'public_html' lo maneja.
// app.get(/(.*)/, (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});