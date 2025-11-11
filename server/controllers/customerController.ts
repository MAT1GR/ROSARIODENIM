// mat1gr/rosariodenim/ROSARIODENIM-cefd39a742f52a93c451ebafdb5a8b992e99e78c/server/controllers/customerController.ts
import { Request, Response } from 'express';
import { db } from '../../src/lib/database';

export const getAllCustomers = (req: Request, res: Response) => {
    try {
        const customers = db.customers.getAll();
        res.json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
};

export const getCustomerById = (req: Request, res: Response) => {
    try {
        // --- CORRECCIÓN AQUÍ ---
        // El error indicaba que la función esperaba un string, no un number.
        const customer = db.customers.getById(req.params.id); 
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ message: 'Error al obtener el cliente' });
    }
};