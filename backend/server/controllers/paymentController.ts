// mat1gr/rosariodenim/ROSARIODENIM-cefd39a742f52a93c451ebafdb5a8b992e99e78c/server/controllers/paymentController.ts
import { Request, Response, Router } from "express";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { db } from "../../src/lib/database.js";
import "dotenv/config";
import { CartItem } from "../../src/types/index.js";

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
    res.json({ preferenceId: result.id, init_point: result.init_point });
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
  console.log("Mercado Pago webhook received. Processing payment...");
  try {
    // --- CORRECCIÓN CRÍTICA AQUÍ (Arregla 15 errores de 'result') ---
    // La variable 'result' no existía. 
    // Debes obtener el ID del pago desde el webhook y buscar el pago.
    const paymentId = req.body.data?.id; 
    if (!paymentId) {
      console.error("Mercado Pago Webhook: No data.id found in req.body");
      return res.status(400).json({ message: "No se recibió ID de pago." });
    }
    
    const payment = new Payment(client);
    const result = await payment.get({ id: paymentId });
    // --- FIN DE LA CORRECCIÓN CRÍTICA ---

    console.log("Mercado Pago Payment Result:", result);

    if (result.status === "approved") {
      const { order: clientOrder } = req.body; // Rename to clientOrder to distinguish

      if (!clientOrder || !clientOrder.items || clientOrder.items.length === 0) {
        console.error("Client order data missing or empty in Mercado Pago webhook.");
        return res.status(400).json({ message: "Datos del pedido del cliente faltantes o vacíos." });
      }

      let subtotal = 0;
      const validatedItems = [];

      for (const clientItem of clientOrder.items) {
        const product = await db.products.getById(clientItem.product.id);
        if (!product) {
          console.error(`Product not found for ID: ${clientItem.product.id}`);
          return res.status(404).json({ message: `Producto no encontrado: ${clientItem.product.name}` });
        }

        // Validate stock for the specific size
        const productSizes = JSON.parse(product.sizes as any);
        if (!productSizes[clientItem.size] || productSizes[clientItem.size].stock < clientItem.quantity) {
          console.error(`Insufficient stock for ${product.name} (Size: ${clientItem.size})`);
          return res.status(400).json({ message: `Stock insuficiente para ${product.name} (Talle: ${clientItem.size})` });
        }

        // Use backend's price, not client's
        subtotal += product.price * clientItem.quantity;
        
        // --- CORRECCIÓN DE TIPO (Línea 148 del error) ---
        // Se asigna el objeto 'product' completo, no uno parcial.
        validatedItems.push({
          product: product, 
          size: clientItem.size,
          quantity: clientItem.quantity,
        });
      }

      const shippingCost = clientOrder.shippingCost || 0; // Use shippingCost from clientOrder, but it should be validated too
      const backendCalculatedTotal = subtotal + shippingCost;

      // Validate total amount against Mercado Pago's processed amount
      if (Math.abs(backendCalculatedTotal - result.transaction_amount!) > 0.01) { // Allow for small floating point differences
        console.error(`Price tampering detected! Backend total: ${backendCalculatedTotal}, MP total: ${result.transaction_amount}`);
        return res.status(400).json({ message: "Discrepancia en el monto total del pedido." });
      }

      const customerData = {
        email: result.payer!.email!,
        name: `${clientOrder.shippingInfo.firstName} ${clientOrder.shippingInfo.lastName}`.trim(),
        phone: clientOrder.shippingInfo.phone,
        totalSpent: result.transaction_amount!,
      };

      const customerId = await db.customers.findOrCreate(customerData);
      await db.products.updateProductStock(clientOrder.items); // Use clientOrder.items for stock update

      const newOrderId = await db.orders.create({
        customerId: customerId.toString(),
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: clientOrder.shippingInfo.phone,
        customerDocNumber: clientOrder.shippingInfo.docNumber,
        items: validatedItems, // Use validated items
        total: backendCalculatedTotal, // Use backend calculated total
        status: "paid",
        shippingStreetName: clientOrder.shippingInfo.streetName,
        shippingStreetNumber: clientOrder.shippingInfo.streetNumber,
        shippingApartment: clientOrder.shippingInfo.apartment,
        shippingDescription: clientOrder.shippingInfo.description,
        shippingCity: clientOrder.shippingInfo.city,
        shippingPostalCode: clientOrder.shippingInfo.postalCode,
        shippingProvince: clientOrder.shippingInfo.province,
        shippingCost: shippingCost,
        shippingName: clientOrder.shipping?.name || 'No especificado',
        createdAt: new Date(result.date_created!),
      });
      console.log(`Order created successfully with ID: ${newOrderId}`);

      res.status(201).json({
        message: "Pago procesado con éxito",
        paymentId: result.id,
        orderId: newOrderId,
        status: result.status,
      });
    } else {
      console.warn(`Mercado Pago payment not approved. Status: ${result.status}`);
      res.status(402).json({
        message: `El pago fue ${result.status}`,
        paymentId: result.id,
        status: result.status,
      });
    }
  } catch (error: any) {
    console.error(
      "Error al procesar el pago en el backend (processPayment):",
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
      const product = await db.products.getById(clientItem.product.id);
      if (!product) {
        console.error(`Product not found in DB for ID: ${clientItem.product.id}`);
        return res.status(404).json({ message: `Producto no encontrado: ${clientItem.product.name}` });
      }
      console.log("Product found:", product.name);

      // Validate stock for the specific size
      let productSizes;
      try {
        productSizes = JSON.parse(product.sizes as any);
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

    const customerId = await db.customers.findOrCreate(customerData);
    console.log("Customer ID:", customerId);
    
    await db.products.updateProductStock(clientItems);
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

    const newOrderId = await db.orders.create(newOrderData);
    console.log("Order created in DB with ID:", newOrderId);

    const createdOrder = await db.orders.getById(newOrderId.toString());
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