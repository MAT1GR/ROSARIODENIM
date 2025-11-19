import { Request, Response } from 'express';
import { db } from '../lib/database.js';


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
        
        // Data Type Conversion
        newProductData.price = parseFloat(newProductData.price) || 0;
        newProductData.waist_flat = newProductData.waist_flat ? parseInt(newProductData.waist_flat, 10) : null;
        newProductData.hip_flat = newProductData.hip_flat ? parseInt(newProductData.hip_flat, 10) : null;
        newProductData.length = newProductData.length ? parseInt(newProductData.length, 10) : null;
        newProductData.isNew = newProductData.isNew === 'true';
        newProductData.isBestSeller = newProductData.isBestSeller === 'true';
        newProductData.isActive = newProductData.isActive === 'true';
        
        if (newProductData.sizes && typeof newProductData.sizes === 'string') {
            newProductData.sizes = JSON.parse(newProductData.sizes);
        }
        
        const imagePaths = files ? files.map(file => `/uploads/${file.filename}`) : [];
        newProductData.images = imagePaths;
        
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

        // Data Type Conversion
        if (productData.price) productData.price = parseFloat(productData.price);
        if (productData.waist_flat) productData.waist_flat = parseInt(productData.waist_flat, 10);
        if (productData.hip_flat) productData.hip_flat = parseInt(productData.hip_flat, 10);
        if (productData.length) productData.length = parseInt(productData.length, 10);
        if (productData.isNew) productData.isNew = productData.isNew === 'true';
        if (productData.isBestSeller) productData.isBestSeller = productData.isBestSeller === 'true';
        if (productData.isActive) productData.isActive = productData.isActive === 'true';

        if (productData.sizes && typeof productData.sizes === 'string') {
            productData.sizes = JSON.parse(productData.sizes);
        }

        let finalImagePaths = existingImages ? JSON.parse(existingImages) : [];
        
        if (files && files.length > 0) {
            const newImagePaths = files.map(file => `/uploads/${file.filename}`);
            finalImagePaths = [...finalImagePaths, ...newImagePaths];
        }

        productData.images = finalImagePaths;

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