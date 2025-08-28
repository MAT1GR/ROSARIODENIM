import { Request, Response } from 'express';

export const calculateShipping = (req: Request, res: Response) => {
    const { postalCode } = req.body;

    if (!postalCode) {
        return res.status(400).json({ message: 'El código postal es requerido.' });
    }

    // --- SIMULACIÓN DE API EXTERNA ---
    // Aquí iría la lógica para conectarse a la API de Correo Argentino
    // con tu clave de API para obtener el costo real.
    // Por ahora, devolveremos un costo simulado.
    console.log(`Calculando envío para el código postal: ${postalCode}`);
    
    // Devolvemos un costo aleatorio entre $2500 y $5500 para simulación
    const shippingCost = Math.floor(Math.random() * 3000) + 2500;

    res.json({ cost: shippingCost });
};