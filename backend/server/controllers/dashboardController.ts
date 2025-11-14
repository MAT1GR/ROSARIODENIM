import { Request, Response } from 'express';
import { db } from '../../src/lib/database.js';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const stats = await db.dashboard.getStats();
        const recentOrders = await db.dashboard.getRecentOrders();
        const recentCustomers = await db.dashboard.getRecentCustomers();
        res.json({ ...stats, recentOrders, recentCustomers });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: 'Error al obtener las estadísticas' });
    }
};