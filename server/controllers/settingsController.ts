import { Request, Response } from 'express';
import { db } from '../../src/lib/database';

export const getAllSettings = (req: Request, res: Response) => {
    try {
        const settings = db.settings.getAll();
        res.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ message: 'Error al obtener la configuración' });
    }
};

export const updateSettings = (req: Request, res: Response) => {
    try {
        const settingsToUpdate = req.body; // { key: value, key2: value2 }
        db.settings.update(settingsToUpdate);
        res.json({ message: 'Configuración guardada con éxito' });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: 'Error al guardar la configuración' });
    }
};