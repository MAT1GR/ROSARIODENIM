// server/controllers/paymentController.ts
import { Request, Response, Router } from "express";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { db } from '../lib/database.js';
import "dotenv/config";
import { CartItem } from "../../server/types/index.js";

const router = Router();

const createMercadoPagoPreference = async (req: Request, res: Response) => {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const apiBaseUrl = process.env.VITE_API_BASE_URL;

    if (!accessToken || !apiBaseUrl) {
      console.error("Error de configuración: Falta token MP o URL base.");
      return res.status(500).json({ message: "Error de configuración del servidor." });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const { items, shippingCost, shippingInfo, shipping } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Carrito inválido." });
    }

    const safeShippingCost = Number(shippingCost) || 0;

    const customerId = db.customers.findOrCreate({
      email: shippingInfo.email,
      name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      phone: shippingInfo.phone,
    });

    const total = items.reduce((acc: number, item: CartItem) => {
      return acc + (Number(item.product.price) * Number(item.quantity));
    }, 0) + safeShippingCost;
    
    // --- CORRECCIÓN: Enviamos el objeto shippingInfo completo para que el servicio lo procese ---
    // --- Además, usamos valores por defecto vacíos para evitar 'undefined' en el objeto ---
    const newOrderId = db.orders.create({
      customerId: customerId.toString(),
      customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      customerEmail: shippingInfo.email,
      customerPhone: shippingInfo.phone,
      customerDocNumber: shippingInfo.docNumber || null,
      items: items,
      total: total,
      status: "pending",
      // Pasamos el objeto completo y dejamos que el servicio maneje la extracción
      shippingInfo: {
          streetName: shippingInfo.streetName || null,
          streetNumber: shippingInfo.streetNumber || null,
          apartment: shippingInfo.apartment || null,
          description: shippingInfo.description || null,
          city: shippingInfo.city || null,
          postalCode: shippingInfo.postalCode || null,
          province: shippingInfo.province || null,
      },
      shippingCost: safeShippingCost,
      shippingName: shipping?.name || 'No especificado',
      createdAt: new Date(),
    });

    const preferenceItems = items.map((item: CartItem) => ({
      id: String(item.product.id),
      title: `${item.product.name} (Talle: ${item.size})`,
      quantity: Number(item.quantity),
      unit_price: Number(item.product.price),
      currency_id: "ARS",
    }));

    if (safeShippingCost > 0) {
      preferenceItems.push({
        id: "shipping",
        title: "Costo de Envío",
        quantity: 1,
        unit_price: safeShippingCost,
        currency_id: "ARS",
      });
    }

    const clientUrl = process.env.VITE_CLIENT_URL || "http://localhost:5173";
    const notificationUrl = `${apiBaseUrl}/api/payments/process-payment`;

    const preferenceBody = {
      items: preferenceItems,
      payer: {
        name: shippingInfo.firstName,
        surname: shippingInfo.lastName,
        email: shippingInfo.email,
      },
      back_urls: {
        success: `${clientUrl}/pago-exitoso?orderId=${newOrderId}`,
        failure: `${clientUrl}/carrito`,
        pending: `${clientUrl}/carrito`,
      },
      auto_return: "approved",
      external_reference: String(newOrderId),
      notification_url: notificationUrl,
      statement_descriptor: "DENIM ROSARIO"
    };

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceBody });
    
    res.json({ preferenceId: result.id, init_point: result.init_point });

  } catch (error: any) {
    console.error("❌ Error MP:", JSON.stringify(error, null, 2));
    res.status(500).json({
      message: "Error al iniciar el pago.",
      error: error.message || "Error desconocido"
    });
  }
};

const processPayment = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;
    const paymentId = data?.id || (type === 'payment' ? req.body.data?.id : null);

    if (paymentId) {
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!accessToken) return res.status(500).send();

      const client = new MercadoPagoConfig({ accessToken });
      const payment = new Payment(client);
      const paymentResult = await payment.get({ id: paymentId });

      const orderId = paymentResult.external_reference;
      if (!orderId) return res.sendStatus(200);

      const order = db.orders.getById(orderId);
      if (!order) return res.sendStatus(404);

      if (paymentResult.status === "approved" && order.status !== 'paid') {
        db.orders.updateStatus(orderId, "paid");
        db.products.updateProductStock(order.items);
        db.customers.updateTotalSpent(order.customerId, paymentResult.transaction_amount || order.total);
        console.log(`✅ Orden ${orderId} PAGADA.`);
      } else if (paymentResult.status && paymentResult.status !== 'approved') {
          db.orders.updateStatus(orderId, paymentResult.status);
      }
    }
    res.sendStatus(200);
  } catch (error: any) {
    console.error("Error webhook:", error.message);
    res.status(500).json({ message: "Error interno webhook" });
  }
};

const createTransferOrder = async (req: Request, res: Response) => {
  const { items: clientItems, shippingInfo, shipping } = req.body as {
    items: CartItem[];
    shippingInfo: any;
    shipping: { name: string; cost: number };
  };

  try {
    if (!clientItems || clientItems.length === 0) return res.status(400).json({ message: "Carrito vacío." });

    let subtotal = 0;
    const validatedItems = [];

    for (const clientItem of clientItems) {
      const product = db.products.getById(clientItem.product.id);
      if (!product) return res.status(404).json({ message: `Producto no encontrado: ${clientItem.product.name}` });

      const productSizes = product.sizes as any;
      if (!productSizes || !productSizes[clientItem.size] || productSizes[clientItem.size].stock < clientItem.quantity) {
        return res.status(400).json({ message: `Sin stock: ${product.name}` });
      }
      subtotal += Number(product.price) * Number(clientItem.quantity);
      validatedItems.push({ product, size: clientItem.size, quantity: clientItem.quantity });
    }

    const shippingCost = Number(shipping?.cost) || 0;
    let finalTotal = (subtotal + shippingCost) * 0.9;

    const customerId = db.customers.findOrCreate({
      email: shippingInfo.email,
      name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
      phone: shippingInfo.phone,
    });
    
    db.products.updateProductStock(validatedItems);

    const newOrderId = db.orders.create({
      customerId: customerId.toString(),
      customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      customerEmail: shippingInfo.email,
      customerPhone: shippingInfo.phone,
      customerDocNumber: shippingInfo.docNumber || null,
      items: validatedItems,
      total: finalTotal,
      status: "pending" as const,
      shippingInfo: {
          streetName: shippingInfo.streetName || null,
          streetNumber: shippingInfo.streetNumber || null,
          apartment: shippingInfo.apartment || null,
          description: shippingInfo.description || null,
          city: shippingInfo.city || null,
          postalCode: shippingInfo.postalCode || null,
          province: shippingInfo.province || null,
      },
      shippingCost: shippingCost,
      shippingName: shipping.name || 'No especificado',
      createdAt: new Date(),
    });

    res.status(201).json({ id: newOrderId.toString(), order: db.orders.getById(newOrderId.toString()) });

  } catch (error: any) {
    console.error("Error orden transferencia:", error);
    res.status(500).json({ message: "Error creando orden." });
  }
};

router.post("/create-preference", createMercadoPagoPreference);
router.post("/process-payment", processPayment);
router.post("/create-transfer-order", createTransferOrder);

export default router;