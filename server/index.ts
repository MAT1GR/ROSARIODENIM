import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path'; // <-- Ya lo tienes

import authRoutes from './routes/auth';
import productRoutes from './routes/products'; // <-- ESTA ES LA LÍNEA CLAVE
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

// --- MODIFICACIÓN 1: Configura CORS para producción ---
// Reemplaza app.use(cors()); con esto:
app.use(cors({ origin: 'https://denimrosario.com.ar' }));

app.use(express.json());

// --- MODIFICACIÓN 2: Servir los archivos estáticos del frontend ---
// Esta línea le dice a Express que sirva CUALQUIER archivo estático
// que se encuentre en la carpeta 'dist' que movimos en el Paso 2.
// '__dirname' es la carpeta actual ('/server'), así que '..' sube un nivel.
app.use(express.static(path.join(__dirname, '..', 'dist')));

// --- MODIFICACIÓN 3: Cambia el puerto para producción (Recomendado) ---
// Esto permite que el hosting (cPanel) elija el puerto.
const PORT = process.env.PORT || 3001;

// --- API Routes ---
// Todas tus rutas API /api/... deben ir ANTES del "catch-all"
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

// --- MODIFICACIÓN 4: El "Catch-All" para React ---
// Esto es VITAL. Debe ir DESPUÉS de todas tus rutas API.
// Le dice al servidor que para CUALQUIER otra ruta (ej: /pago-exitoso, /tienda/producto/123)
// que no sea una API, debe enviar el 'index.html' de React.
// React Router se encargará de mostrar la página correcta en el cliente.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});