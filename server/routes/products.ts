import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getNewProducts,
  getBestsellerProducts,
  getAllAdminProducts
} from '../controllers/productController.js';

const router = Router();

// --- NUEVO: CONFIGURACIÓN DE MULTER PARA GUARDAR ARCHIVOS ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = '/home/denimros/public_html/uploads';
    // Asegurarse de que el directorio de subida exista
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', getAllProducts);
router.get('/all', getAllAdminProducts);
router.get('/newest', getNewProducts);
router.get('/bestsellers', getBestsellerProducts);
router.get('/:id', getProductById);
router.post('/', upload.array('newImages', 10), createProduct);
router.put('/:id', upload.array('newImages', 10), updateProduct);
router.delete('/:id', deleteProduct);

export default router;