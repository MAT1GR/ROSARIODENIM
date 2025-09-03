// Archivo: server/controllers/paymentController.ts

import { Request, Response, Router } from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { db } from '../../src/lib/database';
import 'dotenv/config';
import { CartItem } from '../../src/types';

const router = Router();

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
});

const createMercadoPagoPreference = async (req: Request, res: Response) => {
    const { items, shippingCost, payerInfo } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'La lista de productos es inválida.' });
    }

    try {
        const preferenceItems = items.map((item: CartItem) => ({
            id: item.product.id,
            title: `${item.product.name} (Talle: ${item.size})`,
            quantity: item.quantity,
            unit_price: item.product.price,
            currency_id: 'ARS',
        }));

        if (shippingCost > 0) {
            preferenceItems.push({
                id: 'shipping',
                title: 'Costo de Envío',
                quantity: 1,
                unit_price: shippingCost,
                currency_id: 'ARS',
            });
        }
        
        const preferenceBody = {
            items: preferenceItems,
            payer: {
                name: payerInfo.firstName,
                surname: payerInfo.lastName,
                email: payerInfo.email,
            },
            back_urls: {
                success: 'http://localhost:5173/payment-success',
                failure: 'http://localhost:5173/carrito',
                pending: 'http://localhost:5173/carrito',
            },
            // --- CORRECCIÓN AQUÍ: Se elimina auto_return y se confía en back_urls ---
        };

        const preference = new Preference(client);
        const result = await preference.create({ body: preferenceBody });
        res.json({ preferenceId: result.id });

    } catch (error: any) {
        console.error("Error al crear la preferencia:", error.cause || error.message);
        res.status(500).json({
            message: 'Error interno del servidor al crear la preferencia.',
            error: error.cause ? JSON.stringify(error.cause) : error.message
        });
    }
};

const processPayment = async (req: Request, res: Response) => {
    try {
        const { order, ...paymentData } = req.body;
        const payment = new Payment(client);
        const result = await payment.create({ body: paymentData });

        if (result.status === 'approved') {
            const customerData = {
                email: result.payer!.email!,
                name: `${result.payer!.first_name || ''} ${result.payer!.last_name || ''}`.trim(),
                phone: result.payer!.phone?.number,
                totalSpent: result.transaction_amount!
            };

            const customerId = db.customers.findOrCreate(customerData);
            db.products.updateProductStock(order.items);
            const shippingInfo: any = result.additional_info?.shipments?.receiver_address;
            const shippingAddress = shippingInfo ? `${shippingInfo.street_name || ''} ${shippingInfo.street_number || ''}`.trim() : 'No especificada';

            db.orders.create({
                id: result.id!.toString(),
                customerId: customerId.toString(),
                customerName: customerData.name,
                customerEmail: customerData.email,
                items: order.items,
                total: result.transaction_amount!,
                status: 'paid',
                shipping_address: shippingAddress,
                shipping_city: shippingInfo?.city_name || 'No especificada',
                shipping_postal_code: shippingInfo?.zip_code || 'N/A',
                shipping_cost: order.shippingCost || 0,
                createdAt: new Date(result.date_created!),
            });

            res.status(201).json({ message: 'Pago procesado con éxito', paymentId: result.id, status: result.status });
        } else {
            res.status(402).json({ message: `El pago fue ${result.status}`, paymentId: result.id, status: result.status });
        }
    } catch (error: any) {
        console.error("Error al procesar el pago en el backend:", error.cause || error.message);
        const errorMessage = error.cause?.message || error.message || 'Error desconocido al procesar el pago.';
        res.status(500).json({ message: 'Error al procesar el pago.', error: errorMessage });
    }
};

router.post('/create-mercadopago-preference', createMercadoPagoPreference);
router.post('/process-payment', processPayment);

export default router;