import { Router } from 'express';
import { createMercadoPagoPreference } from '../controllers/paymentController';

const router = Router();

router.post('/create-mercadopago-preference', createMercadoPagoPreference);

export default router;