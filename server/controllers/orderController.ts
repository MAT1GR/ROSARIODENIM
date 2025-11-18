import { Request, Response } from 'express';
import { db } from '../lib/database.js';

export const createOrder = async (req: Request, res: Response) => {
    try {
        // --- CORRECCIÓN AQUÍ ---
        // Se añaden customerName, customerEmail y se renombra totalAmount a total
        const { customerId, customerName, customerEmail, items, shippingAddress, shippingMethod, paymentMethod, total, status = 'pending' } = req.body;

        // Se añaden a la validación
        if (!customerId || !customerName || !customerEmail || !items || !shippingAddress || !shippingMethod || !paymentMethod || !total) {
            return res.status(400).json({ message: 'Faltan campos obligatorios para crear el pedido.' });
        }

        const newOrder = {
            customerId,
            customerName, // Añadido
            customerEmail, // Añadido
            items,
            shippingAddress,
            shippingMethod,
            paymentMethod,
            total, // Renombrado
            status,
            createdAt: new Date(),
        };

        const orderId = db.orders.create(newOrder); // Assuming db.orders.create exists and returns an ID
        res.status(201).json({ message: 'Pedido creado exitosamente', orderId });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: 'Error al crear el pedido' });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = db.orders.getAll();
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
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

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const order = db.orders.getById(orderId);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado.' });
        }
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        res.status(500).json({ message: 'Error al obtener el pedido.' });
    }
};

export const getCustomerOrders = async (req: Request, res: Response) => {
    try {
        const orders = db.orders.getByCustomerId(req.params.id);
        res.json(orders);
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        res.status(500).json({ message: 'Error al obtener los pedidos del cliente' });
    }
};