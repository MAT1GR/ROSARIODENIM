import { Request, Response } from 'express';
import { db } from '../../src/lib/database.js';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
  }
  try {
    const user = await db.auth.authenticateAdmin(username, password);
    
    if (user) {
      res.json({ user });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const success = await db.auth.changeAdminPassword(username, oldPassword, newPassword);
    
    if (success) {
      res.json({ message: 'Contraseña actualizada con éxito' });
    } else {
      res.status(401).json({ message: 'La contraseña actual es incorrecta' });
    }
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};