import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

// Importación de rutas
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import orderRoutes from "./routes/orders";
import customerRoutes from "./routes/customers"; // Reactivado y corregido
import dashboardRoutes from "./routes/dashboard";
import shippingRoutes from "./routes/shipping";
import settingsRoutes from "./routes/settings";
import authRoutes from "./routes/auth";
import paymentRoutes from "./controllers/paymentController";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de CORS y Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Rutas de la API
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes); // Reactivado y corregido
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// Servir la aplicación de React en producción
app.use(express.static(path.join(__dirname, "../../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
