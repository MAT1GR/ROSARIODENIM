import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path'; // <-- Importas 'path', pero no 'url'
// NO importes 'fileURLToPath'

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

// --- LÍNEAS ELIMINADAS ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// Estas variables ya existen "mágicamente" en CommonJS, no necesitas crearlas.

const app = express();
app.use(cors());
app.use(express.json());

// Esta línea ahora usará el __dirname automático
app.use(express.static(path.join(__dirname, '..', 'public')));

const PORT = 3001;

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

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});