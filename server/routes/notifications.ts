import { Router } from 'express';
import { subscribeToDrop } from '../controllers/notificationController.js';

const router = Router();

router.post('/drop', subscribeToDrop);

export default router;
