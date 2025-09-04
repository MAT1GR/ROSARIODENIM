// Archivo: server/controllers/paymentController.ts

import { Request, Response, Router } from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { db } from '../../src/lib/database';
import 'dotenv/config';
import { CartItem } from '../../src/types';

const router = Router();

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
});

const processPayment = async (req: Request, res: Response) => {
    try {
        const { order, ...paymentData } = req.body;
        const payment = new Payment(client);
        const result = await payment.create({ body: paymentData });

        if (result.status === 'approved') {
            const customerData = {
                email: result.payer!.email!,
                name: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`.trim(),
                phone: order.shippingInfo.phone,
                totalSpent: result.transaction_amount!
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
                status: 'paid',
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

            res.status(201).json({ message: 'Pago procesado con éxito', paymentId: result.id, status: result.status });
        } else {
            res.status(402).json({ message: `El pago fue ${result.status}`, paymentId: result.id, status: result.status });
        }
    } catch (error: any) {
        console.error("Error al procesar el pago en el backend:", error.cause || error.message);
        const errorMessage = error.cause?.message || 'Error desconocido al procesar el pago.';
        res.status(500).json({ message: 'Error al procesar el pago.', error: errorMessage });
    }
};

router.post('/process-payment', processPayment);

export default router;
