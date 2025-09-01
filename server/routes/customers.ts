import { Router } from 'express';
import { getAllCustomers, getCustomerById } from '../controllers/customerController';
import { getCustomerOrders } from '../controllers/orderController';

const router = Router();

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.get('/:id/orders', getCustomerOrders);

export default router;