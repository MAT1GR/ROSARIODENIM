import { Router } from 'express';
import { login, changePassword } from '../controllers/authController.js'; // Se importa changePassword

const router = Router();

router.post('/login', login);
router.post('/change-password', changePassword); // Se añade la nueva ruta

export default router;