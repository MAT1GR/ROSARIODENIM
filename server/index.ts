import 'dotenv/config'; // <-- AÑADIR ESTA LÍNEA AL PRINCIPIO DE TODO
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import orderRoutes from './routes/orders';
import customerRoutes from './routes/customers';
import settingsRoutes from './routes/settings';
import dashboardRoutes from './routes/dashboard';
import shippingRoutes from './routes/shipping';
import paymentRoutes from './routes/payments';

// --- VERIFICACIÓN CRUCIAL ---
console.log("Verificando Access Token cargado:", process.env.MERCADOPAGO_ACCESS_TOKEN);
// -------------------------

const app = express();
app.use(cors());
app.use(express.json());

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
app.use('/api/payments', paymentRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});