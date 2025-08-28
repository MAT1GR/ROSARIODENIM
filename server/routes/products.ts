import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getNewProducts,
  getBestsellerProducts,
  getAllAdminProducts // <-- AÑADIR
} from '../controllers/productController';

const router = Router();

router.get('/', getAllProducts);
router.get('/all', getAllAdminProducts); // <-- AÑADIR
router.get('/newest', getNewProducts);
router.get('/bestsellers', getBestsellerProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;