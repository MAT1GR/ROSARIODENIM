import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import orderRoutes from './routes/orders';
import customerRoutes from './routes/customers';
import settingsRoutes from './routes/settings';
import dashboardRoutes from './routes/dashboard';


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


app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});