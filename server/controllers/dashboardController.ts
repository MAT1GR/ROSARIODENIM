import { Request, Response } from 'express';
import { db } from '../lib/database.js';


export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const stats = db.dashboard.getStats();
        const recentOrders = db.dashboard.getRecentOrders();
        const recentCustomers = db.dashboard.getRecentCustomers(); 
        res.json({ ...stats, recentOrders, recentCustomers });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: 'Error al obtener las estadísticas' });
    }
};