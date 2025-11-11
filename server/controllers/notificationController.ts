import { Request, Response } from 'express';
import { db } from '../../src/lib/db/connection';

export const subscribeToDrop = (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El email es requerido.' });
  }

  try {
    // Check if email already exists
    const existing = db.prepare('SELECT id FROM drop_notifications WHERE email = ?').get(email);
    if (existing) {
      return res.status(200).json({ message: 'Ya estás suscripto.' });
    }

    const stmt = db.prepare('INSERT INTO drop_notifications (email) VALUES (?)');
    stmt.run(email);
    
    res.status(201).json({ message: '¡Gracias por suscribirte! Te avisaremos.' });
  } catch (error: any) {
    // Handle unique constraint violation separately
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(200).json({ message: 'Ya estás suscripto.' });
    }
    console.error("Error subscribing to drop:", error);
    res.status(500).json({ message: 'Error al procesar la suscripción.' });
  }
};
