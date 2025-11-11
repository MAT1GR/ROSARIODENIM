import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path'; // <-- Importante

// --- Tus importaciones de rutas ---
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import orderRoutes from './routes/orders';
import customerRoutes from './routes/customers';
import settingsRoutes from './routes/settings';
import dashboardRoutes from './routes/dashboard';
import shippingRoutes from './routes/shipping';
import testimonialsRoutes from './routes/testimonials';
import notificationRoutes from './routes/notifications';
import paymentRoutes from './controllers/paymentController';

const app = express();

// --- Configuración de CORS ---
app.use(cors({ origin: 'https://denimrosario.com.ar' }));
app.use(express.json());

// --- SERVIR ARCHIVOS ESTÁTICOS (CORREGIDO) ---

// 1. Servir el Frontend (React)
// __dirname será '.../dist/server'
// Subimos un nivel ('..') para llegar a '.../dist'
app.use(express.static(path.join(__dirname, '..')));

// 2. Servir las Imágenes (public/uploads)
// Subimos dos niveles ('..', '..') desde '.../dist/server' para llegar a la RAÍZ
// Y de ahí entramos a 'public'.
app.use(express.static(path.join(__dirname, '..', '..', 'public')));


// --- Puerto de Producción ---
const PORT = process.env.PORT || 3001;

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);

// --- "Catch-All" para React (CORREGIDO) ---
// Esto debe apuntar al index.html que está en '.../dist'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});