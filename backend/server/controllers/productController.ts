import { Request, Response } from 'express';
import { db } from '../../src/lib/database.js';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 9,
    };
    const result = await db.products.getAll(filters);
    res.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

export const getAllAdminProducts = async (req: Request, res: Response) => {
    try {
        const products = await db.products.getAllAdmin();
        res.json(products);
    } catch (error) {
        console.error("Error fetching admin products:", error);
        res.status(500).json({ message: 'Error al obtener los productos para admin' });
    }
};

export const getNewProducts = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 4;
        const products = await db.products.getNewest(limit);
        res.json(products);
    } catch (error) {
        console.error("Error fetching new products:", error);
        res.status(500).json({ message: 'Error al obtener los productos nuevos' });
    }
};

export const getBestsellerProducts = async (req: Request, res: Response) => {
    try {
        const products = await db.products.getBestsellers();
        res.json(products);
    } catch (error) {
        console.error("Error fetching bestseller products:", error);
        res.status(500).json({ message: 'Error al obtener los productos más vendidos' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await db.products.getById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error("Error fetching product by id:", error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const newProductData = req.body;
        const files = req.files as Express.Multer.File[];
        
        if (newProductData.sizes && typeof newProductData.sizes === 'string') {
            newProductData.sizes = JSON.parse(newProductData.sizes);
        }
        
        const imagePaths = files ? files.map(file => `/uploads/${file.filename}`) : [];
        newProductData.images = imagePaths;

        // --- INICIO DE LA CORRECCIÓN ---
        // Convertimos explícitamente los valores de 'isNew' y 'isBestSeller' a booleanos.
        newProductData.isNew = newProductData.isNew === 'true';
        newProductData.isBestSeller = newProductData.isBestSeller === 'true';
        // --- FIN DE LA CORRECCIÓN ---
        
        const createdProductId = await db.products.create(newProductData);
        const createdProduct = await db.products.getById(createdProductId);
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { existingImages, ...productData } = req.body;
        const files = req.files as Express.Multer.File[];

        if (productData.sizes && typeof productData.sizes === 'string') {
            productData.sizes = JSON.parse(productData.sizes);
        }

        let finalImagePaths = existingImages ? JSON.parse(existingImages) : [];
        
        if (files && files.length > 0) {
            const newImagePaths = files.map(file => `/uploads/${file.filename}`);
            finalImagePaths = [...finalImagePaths, ...newImagePaths];
        }

        productData.images = finalImagePaths;

        // --- INICIO DE LA CORRECCIÓN ---
        // También aplicamos la conversión en la actualización.
        productData.isNew = productData.isNew === 'true';
        productData.isBestSeller = productData.isBestSeller === 'true';
        // --- FIN DE LA CORRECCIÓN ---

        const updated = await db.products.update(req.params.id, productData);
        if (updated) {
            const updatedProduct = await db.products.getById(req.params.id);
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Producto no encontrado para actualizar' });
        }
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deleted = await db.products.delete(req.params.id);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Producto no encontrado para eliminar' });
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};