// Archivo: server/controllers/paymentController.ts

import { Request, Response, Router } from "express";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { db } from "../../src/lib/database";
import "dotenv/config";
import { CartItem } from "../../src/types";

const router = Router();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const createMercadoPagoPreference = async (req: Request, res: Response) => {
  const { items, shippingCost, shippingInfo } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "La lista de productos es inválida." });
  }

  try {
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
        success: `${
          process.env.VITE_CLIENT_URL || "http://localhost:5173"
        }/pago-exitoso`,
        failure: `${
          process.env.VITE_CLIENT_URL || "http://localhost:5173"
        }/carrito`,
        pending: `${
          process.env.VITE_CLIENT_URL || "http://localhost:5173"
        }/carrito`,
      },
      // Se elimina auto_return para solucionar el conflicto con back_urls
    };

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceBody });
    res.json({ preferenceId: result.id });
  } catch (error: any) {
    console.error(
      "Error al crear la preferencia:",
      error.cause || error.message
    );
    res.status(500).json({
      message: "Error interno del servidor al crear la preferencia.",
      error: error.cause ? JSON.stringify(error.cause) : error.message,
    });
  }
};

const processPayment = async (req: Request, res: Response) => {
  // (Esta función no necesita cambios y se mantiene igual)
  try {
    const { order, ...paymentData } = req.body;
    const payment = new Payment(client);
    const result = await payment.create({ body: paymentData });

    if (result.status === "approved") {
      const customerData = {
        email: result.payer!.email!,
        name: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`.trim(),
        phone: order.shippingInfo.phone,
        totalSpent: result.transaction_amount!,
      };

      const customerId = db.customers.findOrCreate(customerData);
      db.products.updateProductStock(order.items);

      db.orders.create({
        id: result.id!.toString(),
        customerId: customerId.toString(),
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: order.shippingInfo.phone,
        customerDocNumber: order.shippingInfo.docNumber,
        items: order.items,
        total: result.transaction_amount!,
        status: "paid",
        shippingStreetName: order.shippingInfo.streetName,
        shippingStreetNumber: order.shippingInfo.streetNumber,
        shippingApartment: order.shippingInfo.apartment,
        shippingDescription: order.shippingInfo.description,
        shippingCity: order.shippingInfo.city,
        shippingPostalCode: order.shippingInfo.postalCode,
        shippingProvince: order.shippingInfo.province,
        shippingCost: order.shippingCost || 0,
        createdAt: new Date(result.date_created!),
      });

      res.status(201).json({
        message: "Pago procesado con éxito",
        paymentId: result.id,
        status: result.status,
      });
    } else {
      res.status(402).json({
        message: `El pago fue ${result.status}`,
        paymentId: result.id,
        status: result.status,
      });
    }
  } catch (error: any) {
    console.error(
      "Error al procesar el pago en el backend:",
      error.cause || error.message
    );
    const errorMessage =
      error.cause?.message || "Error desconocido al procesar el pago.";
    res
      .status(500)
      .json({ message: "Error al procesar el pago.", error: errorMessage });
  }
};

// --- FUNCIÓN PARA TRANSFERENCIAS (CORREGIDA) ---
const createTransferOrder = async (req: Request, res: Response) => {
  const { items, shippingInfo, shipping, total } = req.body as {
    items: CartItem[];
    shippingInfo: any;
    shipping: { name: string; cost: number };
    total: number;
  };

  try {
    const orderId = `TRANSFER-${Date.now()}`;
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 60);

    const customerData = {
      email: shippingInfo.email,
      name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
      phone: shippingInfo.phone,
      totalSpent: total, // Se podría actualizar después si el pago se confirma
    };

    // Crear o encontrar cliente
    const customerId = await db.customers.findOrCreate(customerData);
    // Actualizar stock
    await db.products.updateProductStock(items);

    const newOrderData = {
      id: orderId,
      customerId: customerId.toString(),
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: shippingInfo.phone,
      customerDocNumber: shippingInfo.docNumber || "",
      items: items,
      total: total,
      status: "pending", // Estado especial para transferencias
      shippingStreetName: shippingInfo.streetName,
      shippingStreetNumber: shippingInfo.streetNumber,
      shippingApartment: shippingInfo.apartment,
      shippingDescription: shippingInfo.description || "",
      shippingCity: shippingInfo.city,
      shippingPostalCode: shippingInfo.postalCode,
      shippingProvince: shippingInfo.province,
      shippingCost: shipping.cost || 0,
      createdAt: new Date(),
    };

    // Crear la orden en la base de datos
    await db.orders.create(newOrderData);

    // *** INICIO DE LA CORRECCIÓN ***
    // 1. Busca la orden recién creada para obtener todos sus datos.
    const createdOrder = await db.orders.getById(orderId);

    // 2. Control de error por si la orden no se encuentra.
    if (!createdOrder) {
      return res
        .status(500)
        .json({ message: "La orden fue creada pero no pudo ser encontrada." });
    }

    // 3. Devuelve el ID y el objeto 'order' completo.
    res.status(201).json({ id: orderId, order: createdOrder });
    // *** FIN DE LA CORRECCIÓN ***
  } catch (error) {
    console.error("Error creating transfer order:", error);
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
