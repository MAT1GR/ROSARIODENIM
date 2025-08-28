import { Request, Response } from 'express';
import { db } from '../../src/lib/database';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
  }
  try {
    // La corrección está en la siguiente línea:
    const user = await db.auth.authenticateAdmin(username, password);
    
    if (user) {
      // En una aplicación real, aquí se generaría y enviaría un token JWT
      res.json({ user });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};