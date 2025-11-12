import { Router } from 'express';
import { getAllSettings, updateSettings } from '../controllers/settingsController.js';

const router = Router();

router.get('/', getAllSettings);
router.post('/', updateSettings);

export default router;