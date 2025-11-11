import { Request, Response } from 'express';
import { db } from '../../src/lib/database';
import { Category } from '../../src/types';

export const getAllCategories = (req: Request, res: Response) => {
  try {
    const categories = db.categories.getAll();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: 'Error al obtener las categorías' });
  }
};

export const createCategory = (req: Request, res: Response) => {
  try {
    const newCategoryData = req.body as Omit<Category, 'id'>;
    const createdCategoryId = db.categories.create(newCategoryData);
    const createdCategory = db.categories.getById(createdCategoryId);
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: 'Error al crear la categoría' });
  }
};

export const updateCategory = (req: Request, res: Response) => {
  try {
    const updated = db.categories.update(Number(req.params.id), req.body);
    if (updated) {
      const updatedCategory = db.categories.getById(Number(req.params.id));
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Categoría no encontrada para actualizar' });
    }
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: 'Error al actualizar la categoría' });
  }
};

export const deleteCategory = (req: Request, res: Response) => {
  try {
    const deleted = db.categories.delete(Number(req.params.id));
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Categoría no encontrada para eliminar' });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: 'Error al eliminar la categoría' });
  }
};