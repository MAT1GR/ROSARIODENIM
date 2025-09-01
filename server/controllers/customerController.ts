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
        const customer = db.customers.getById(Number(req.params.id));
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