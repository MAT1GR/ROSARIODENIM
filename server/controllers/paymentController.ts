import { Request, Response, Router } from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { db } from '../../src/lib/database';
import 'dotenv/config';

const router = Router();

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
});

const processPayment = async (req: Request, res: Response) => {
    try {
        const { order, ...formData } = req.body;
        const { shippingInfo, items, shippingCost, total } = order;
            
        const paymentPayload = {
            transaction_amount: Number(total),
            token: formData.token,
            description: `Orden de compra de ${shippingInfo.firstName} ${shippingInfo.lastName}`,
            installments: formData.installments,
            payment_method_id: formData.payment_method_id,
            issuer_id: formData.issuer_id,
            payer: {
                email: shippingInfo.email,
                first_name: shippingInfo.firstName,
                last_name: shippingInfo.lastName,
                identification: {
                    type: "DNI",
                    number: shippingInfo.docNumber
                }
            }
        };

        const payment = new Payment(client);
        const result = await payment.create({ body: paymentPayload });

        if (result.status === 'approved') {
            const customerData = {
                email: shippingInfo.email,
                name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
                phone: shippingInfo.phone,
                totalSpent: result.transaction_amount!
            };

            const customerId = db.customers.findOrCreate(customerData);
            db.products.updateProductStock(items);

            db.orders.create({
                id: result.id!.toString(),
                customerId: customerId.toString(),
                customerName: customerData.name,
                customerEmail: customerData.email,
                customerPhone: shippingInfo.phone,
                customerDocNumber: shippingInfo.docNumber,
                items: items,
                total: result.transaction_amount!,
                status: 'paid',
                shippingStreetName: shippingInfo.streetName,
                shippingStreetNumber: shippingInfo.streetNumber,
                shippingApartment: shippingInfo.apartment,
                shippingDescription: shippingInfo.description,
                shippingCity: shippingInfo.city,
                shippingPostalCode: shippingInfo.postalCode,
                shippingProvince: shippingInfo.province,
                shippingCost: shippingCost || 0,
                // --- INICIO DE LA CORRECCIÓN: Se pasa un objeto Date ---
                createdAt: new Date(result.date_created!),
                // --- FIN DE LA CORRECCIÓN ---
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

