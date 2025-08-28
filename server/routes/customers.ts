import { Router } from 'express';
import { getAllCustomers } from '../controllers/customerController';

const router = Router();

router.get('/', getAllCustomers);

export default router;