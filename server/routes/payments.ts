import { Router } from 'express';
import { createMercadoPagoPreference, processPayment } from '../controllers/paymentController';

const router = Router();

router.post('/create-mercadopago-preference', createMercadoPagoPreference);
router.post('/process-payment', processPayment); 

export default router;