import { Request, Response, Router } from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { db } from '../../src/lib/database';
import 'dotenv/config';
import { CartItem } from '../../src/types';

const router = Router();

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export const createMercadoPagoPreference = async (req: Request, res: Response) => {
    // IGNORAMOS TEMPORALMENTE LOS DATOS DEL CARRITO PARA LA PRUEBA
    // const { items, shippingCost } = req.body;

    try {
        // --- INICIO DE LA MODIFICACIÓN DE DIAGNÓSTICO ---
        // Creamos un cuerpo de preferencia súper simple y hardcodeado.
        // Si esto funciona, el problema está en los datos del carrito.
        // Si esto falla, el problema está en tus credenciales o cuenta de Mercado Pago.
        const preferenceBody = {
            items: [
                {
                    id: 'producto_prueba',
                    title: 'Producto de Prueba',
                    quantity: 1,
                    unit_price: 1500, // Un precio fijo para probar
                    currency_id: 'ARS',
                },
            ],
            back_urls: {
                success: 'http://localhost:5173/payment-success',
                failure: 'http://localhost:5173/carrito',
                pending: 'http://localhost:5173/carrito',
            },
        };

        // Imprimimos en la consola del servidor exactamente lo que vamos a enviar
        console.log("Creando preferencia con el siguiente cuerpo:", JSON.stringify(preferenceBody, null, 2));
        // --- FIN DE LA MODIFICACIÓN DE DIAGNÓSTICO ---

        const preference = new Preference(client);
        const result = await preference.create({ body: preferenceBody });
        
        console.log("Preferencia creada con éxito. ID:", result.id);
        res.json({ preferenceId: result.id });

    } catch (error: any) {
        // Logueamos el error completo para tener más detalles
        console.error("Error detallado al crear la preferencia:", error); 
        res.status(500).json({ 
            message: 'Error interno del servidor al crear la preferencia de pago.',
            error: error.cause ? JSON.stringify(error.cause) : error.message
        });
    }
};

export const processPayment = async (req: Request, res: Response) => {
    try {
        const { order, ...paymentData } = req.body;
        const payment = new Payment(client);

        const result = await payment.create({ body: paymentData });

        if (result.status === 'approved') {
            const customerData = {
                email: result.payer!.email!,
                name: `${result.payer!.first_name || 'Comprador'} ${result.payer!.last_name || ''}`.trim(),
                phone: result.payer!.phone?.number,
                totalSpent: result.transaction_amount! 
            };

            const customerId = db.customers.findOrCreate(customerData);
            // Nota: El stock no se descontará en este modo de prueba, lo cual es correcto.
            // db.products.updateProductStock(order.items);

            db.orders.create({
                id: result.id!.toString(),
                customerId: customerId.toString(),
                customerName: customerData.name,
                customerEmail: customerData.email,
                items: order.items, // Guardamos los items reales aunque la pref sea de prueba
                total: result.transaction_amount!,
                status: 'paid',
                createdAt: new Date(result.date_created!),
            });

            res.status(201).json({
                message: 'Pago procesado con éxito',
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
        console.error("Error al procesar el pago en el backend:", error.cause || error.message);
        const errorMessage = error.cause?.message || error.message || 'Error desconocido al procesar el pago.';
        res.status(500).json({
            message: 'Error al procesar el pago.',
            error: errorMessage
        });
    }
};

router.post('/create-mercadopago-preference', createMercadoPagoPreference);
router.post('/process-payment', processPayment); 

export default router;