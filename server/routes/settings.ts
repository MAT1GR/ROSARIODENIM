import { Router } from 'express';
import { getAllSettings, updateSettings } from '../controllers/settingsController';

const router = Router();

router.get('/', getAllSettings);
router.post('/', updateSettings);

export default router;