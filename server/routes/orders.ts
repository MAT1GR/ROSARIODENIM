import { Router } from 'express';
import { getAllOrders, updateOrderStatus, getCustomerOrders, createOrder, getOrderById } from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/customer/:id', getCustomerOrders);
router.put('/:id/status', updateOrderStatus);

export default router;