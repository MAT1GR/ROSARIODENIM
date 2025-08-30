import { Request, Response } from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import 'dotenv/config';

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export const createMercadoPagoPreference = async (req: Request, res: Response) => {
    const { items, shippingCost } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'La lista de productos es inválida.' });
    }

    try {
        const preferenceItems = items.map((item: any) => ({
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
                name: "Comprador",
                surname: "RosarioDenim",
                email: "test_user_123456@testuser.com",
            },
            back_urls: {
                success: 'http://localhost:5173/payment-success',
                failure: 'http://localhost:5173/carrito',
                pending: 'http://localhost:5173/carrito',
            },
        };

        const preference = new Preference(client);
        const result = await preference.create({ body: preferenceBody });
        
        res.json({ preferenceId: result.id });

    } catch (error: any) {
        console.error("Error al crear la preferencia de Mercado Pago:");
        console.error(error.cause || error.message); 
        
        res.status(500).json({ 
            message: 'Error interno del servidor al crear la preferencia de pago.',
            error: error.cause || error.message
        });
    }
};

// --- NUEVA FUNCIÓN AÑADIDA ---
export const processPayment = async (req: Request, res: Response) => {
    try {
        const paymentData = req.body;
        const payment = new Payment(client);

        console.log("Procesando pago con los siguientes datos:", paymentData);
        const result = await payment.create({ body: paymentData });

        res.status(201).json({
            message: 'Pago procesado con éxito',
            paymentId: result.id,
            status: result.status,
            statusDetail: result.status_detail,
        });

    } catch (error: any) {
        console.error("Error al procesar el pago en el backend:", error.cause || error.message);
        
        const errorMessage = error.cause?.message || error.message || 'Error desconocido al procesar el pago.';
        res.status(500).json({
            message: 'Error al procesar el pago.',
            error: errorMessage
        });
    }
};