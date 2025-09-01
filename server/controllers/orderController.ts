import { Request, Response } from 'express';
import { db } from '../../src/lib/database';

export const getAllOrders = (req: Request, res: Response) => {
    try {
        const orders = db.orders.getAll();
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
};

export const updateOrderStatus = (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const updated = db.orders.updateStatus(req.params.id, status);
        if (updated) {
            res.json({ message: 'Estado del pedido actualizado' });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: 'Error al actualizar el estado del pedido' });
    }
};

export const getCustomerOrders = (req: Request, res: Response) => {
    try {
        const orders = db.orders.getByCustomerId(req.params.id);
        res.json(orders);
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        res.status(500).json({ message: 'Error al obtener los pedidos del cliente' });
    }
};