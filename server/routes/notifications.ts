import { Router } from 'express';
import { subscribeToDrop } from '../controllers/notificationController';

const router = Router();

router.post('/drop', subscribeToDrop);

export default router;
