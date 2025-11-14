import { Router } from 'express';
import { calculateShipping } from '../controllers/shippingController.js';

const router = Router();

router.post('/calculate', calculateShipping);

export default router;