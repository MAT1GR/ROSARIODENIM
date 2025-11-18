// mat1gr/rosariodenim/ROSARIODENIM-cefd39a742f52a93c451ebafdb5a8b992e99e78c/server/controllers/paymentController.ts
import { Request, Response, Router } from "express";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { db } from '../lib/database.js';

import "dotenv/config";
import { CartItem } from "../../server/types/index.js";

const router = Router();

const createMercadoPagoPreference = async (req: Request, res: Response) => {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("MERCADOPAGO_ACCESS_TOKEN is not defined in environment variables.");
      return res.status(500).json({ message: "Error de configuración del servidor: el token de Mercado Pago no está configurado." });
    }
    const client = new MercadoPagoConfig({ accessToken });

    const { items, shippingCost, shippingInfo, shipping } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "La lista de productos es inválida." });
    }

    // 1. Find or create customer
    const customerId = db.customers.findOrCreate({
      email: shippingInfo.email,
      name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      phone: shippingInfo.phone,
    });

    // 2. Create a pending order
    const total = items.reduce((acc: number, item: CartItem) => acc + item.product.price * item.quantity, 0) + shippingCost;
    
    const newOrderId = db.orders.create({
      customerId: customerId.toString(),
      customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      customerEmail: shippingInfo.email,
      customerPhone: shippingInfo.phone,
      customerDocNumber: shippingInfo.docNumber,
      items: items,
      total: total,
      status: "pending",
      shippingStreetName: shippingInfo.streetName,
      shippingStreetNumber: shippingInfo.streetNumber,
      shippingApartment: shippingInfo.apartment,
      shippingDescription: shippingInfo.description,
      shippingCity: shippingInfo.city,
      shippingPostalCode: shippingInfo.postalCode,
      shippingProvince: shippingInfo.province,
      shippingCost: shippingCost,
      shippingName: shipping?.name || 'No especificado',
      createdAt: new Date(),
    });

    const preferenceItems = items.map((item: CartItem) => ({
      id: item.product.id,
      title: `${item.product.name} (Talle: ${item.size})`,
      quantity: item.quantity,
      unit_price: item.product.price,
      currency_id: "ARS",
    }));

    if (shippingCost > 0) {
      preferenceItems.push({
        id: "shipping",
        title: "Costo de Envío",
        quantity: 1,
        unit_price: shippingCost,
        currency_id: "ARS",
      });
    }

    const preferenceBody = {
      items: preferenceItems,
      payer: {
        name: shippingInfo.firstName,
        surname: shippingInfo.lastName,
        email: shippingInfo.email,
      },
      back_urls: {
        success: `${process.env.VITE_CLIENT_URL || "http://localhost:5173"}/pago-exitoso?orderId=${newOrderId}`,
        failure: `${process.env.VITE_CLIENT_URL || "http://localhost:5173"}/carrito`,
        pending: `${process.env.VITE_CLIENT_URL || "http://localhost:5173"}/carrito`,
      },
      external_reference: newOrderId,
      notification_url: `${process.env.VITE_API_BASE_URL}/api/payments/process-payment`,
    };

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceBody });
    res.json({ preferenceId: result.id, init_point: result.init_point });

  } catch (error: any) {
    console.error("Error al crear la preferencia:", error.cause || error.message);
    res.status(500).json({
      message: "Error interno del servidor al crear la preferencia.",
      error: error.cause ? JSON.stringify(error.cause) : error.message,
    });
  }
};

const processPayment = async (req: Request, res: Response) => {
  console.log("Mercado Pago webhook received:", JSON.stringify(req.body, null, 2));
  
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!accessToken) {
        console.error("MERCADOPAGO_ACCESS_TOKEN is not defined in environment variables.");
        return res.status(500).json({ message: "Error de configuración del servidor." });
      }
      const client = new MercadoPagoConfig({ accessToken });

      const payment = new Payment(client);
      const paymentResult = await payment.get({ id: data.id });

      console.log("Mercado Pago Payment Result:", paymentResult);

      const orderId = paymentResult.external_reference;
      if (!orderId) {
        console.error("Webhook error: external_reference (orderId) not found in payment result.");
        return res.status(400).json({ message: "Referencia externa no encontrada." });
      }

      const order = db.orders.getById(orderId);
      if (!order) {
        console.error(`Webhook error: Order with ID ${orderId} not found.`);
        return res.status(404).json({ message: "Pedido no encontrado." });
      }

      if (paymentResult.status === "approved" && order.status !== 'paid') {
        db.orders.updateStatus(orderId, "paid");
        db.products.updateProductStock(order.items);
        
        const totalSpent = paymentResult.transaction_amount || order.total;
        db.customers.updateTotalSpent(order.customerId, totalSpent);

        console.log(`Order ${orderId} updated to paid.`);
      } else {
        console.warn(`Payment not approved or order already processed. MP Status: ${paymentResult.status}, Order Status: ${order.status}`);
        if (paymentResult.status && paymentResult.status !== 'pending' && paymentResult.status !== 'in_mediation' && paymentResult.status !== 'approved') {
            db.orders.updateStatus(orderId, paymentResult.status);
        }
      }
    }
    res.sendStatus(200);
  } catch (error: any) {
    console.error("Error processing webhook:", error.cause || error.message);
    res.status(500).json({ message: "Error al procesar el webhook." });
  }
};

// --- FUNCIÓN PARA TRANSFERENCIAS (CORREGIDA) ---
const createTransferOrder = async (req: Request, res: Response) => {
  const { items: clientItems, shippingInfo, shipping } = req.body as {
    items: CartItem[];
    shippingInfo: any;
    shipping: { name: string; cost: number };
  };

  console.log("Attempting to create transfer order...");
  console.log("Client Items:", clientItems);
  console.log("Shipping Info:", shippingInfo);
  console.log("Shipping:", shipping);

  try {
    if (!clientItems || clientItems.length === 0) {
      console.warn("Cart is empty for transfer order.");
      return res.status(400).json({ message: "El carrito está vacío." });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const clientItem of clientItems) {
      console.log(`Validating product ID: ${clientItem.product.id}, Size: ${clientItem.size}, Quantity: ${clientItem.quantity}`);
      const product = db.products.getById(clientItem.product.id);
      if (!product) {
        console.error(`Product not found in DB for ID: ${clientItem.product.id}`);
        return res.status(404).json({ message: `Producto no encontrado: ${clientItem.product.name}` });
      }
      console.log("Product found:", product.name);

      // Validate stock for the specific size
      let productSizes;
      try {
        productSizes = product.sizes as any;
      } catch (jsonError) {
        console.error(`Error parsing product sizes for product ID ${product.id} (${product.name}):`, jsonError);
        return res.status(400).json({ message: `Error de configuración del producto: el formato de talles para "${product.name}" es inválido. Por favor, contacta a soporte.` });
      }
      
      if (!productSizes[clientItem.size] || productSizes[clientItem.size].stock < clientItem.quantity) {
        console.error(`Insufficient stock for ${product.name} (Talle: ${clientItem.size}). Requested: ${clientItem.quantity}, Available: ${productSizes[clientItem.size]?.stock || 0}`);
        return res.status(400).json({ message: `Stock insuficiente para ${product.name} (Talle: ${clientItem.size})` });
      }

      subtotal += product.price * clientItem.quantity;

      // --- CORRECCIÓN DE TIPO (Línea 291 del error) ---
      // Se asigna el objeto 'product' completo, no uno parcial.
      validatedItems.push({
        product: product,
        size: clientItem.size,
        quantity: clientItem.quantity,
      });
    }
    console.log("Subtotal calculated:", subtotal);

    const shippingCost = shipping?.cost || 0;
    let finalTotal = subtotal + shippingCost;
    finalTotal = finalTotal * 0.9; // 10% discount
    console.log("Final total (with shipping and discount):", finalTotal);

    const customerData = {
      email: shippingInfo.email,
      name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
      phone: shippingInfo.phone,
      totalSpent: finalTotal,
    };
    console.log("Customer Data:", customerData);

    const customerId = db.customers.findOrCreate(customerData);
    console.log("Customer ID:", customerId);
    
    db.products.updateProductStock(clientItems);
    console.log("Product stock updated.");

    const newOrderData = {
      customerId: customerId.toString(),
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: shippingInfo.phone,
      customerDocNumber: shippingInfo.docNumber || "",
      items: validatedItems,
      total: finalTotal,
      status: "pending" as const,
      shippingStreetName: shippingInfo.streetName,
      shippingStreetNumber: shippingInfo.streetNumber,
      shippingApartment: shippingInfo.apartment,
      shippingDescription: shippingInfo.description || "",
      shippingCity: shippingInfo.city,
      shippingPostalCode: shippingInfo.postalCode,
      shippingProvince: shippingInfo.province,
      shippingCost: shippingCost,
      shippingName: shipping.name || 'No especificado',
      createdAt: new Date(),
    };
    console.log("New Order Data prepared:", newOrderData);

    const newOrderId = db.orders.create(newOrderData);
    console.log("Order created in DB with ID:", newOrderId);

    const createdOrder = db.orders.getById(newOrderId.toString());
    if (!createdOrder) {
      console.error(`Order with ID ${newOrderId} not found after creation.`);
      return res
        .status(500)
        .json({ message: "La orden fue creada pero no pudo ser encontrada." });
    }
    console.log("Created order retrieved:", createdOrder.id);

    res.status(201).json({ id: newOrderId.toString(), order: createdOrder });
  } catch (error) {
    console.error("Unhandled error creating transfer order:", error);
    res
      .status(500)
      .json({ message: "No se pudo crear la orden para la transferencia." });
  }
};

router.post("/create-preference", createMercadoPagoPreference);
router.post("/process-payment", processPayment);
// --- NUEVA RUTA PARA TRANSFERENCIAS ---
router.post("/create-transfer-order", createTransferOrder);

export default router;