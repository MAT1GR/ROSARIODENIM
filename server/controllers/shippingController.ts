import { Request, Response } from 'express';

export const calculateShipping = (req: Request, res: Response) => {
    const { postalCode } = req.body;

    if (!postalCode) {
        return res.status(400).json({ message: 'El código postal es requerido.' });
    }

    // --- LÓGICA DE ENVÍO CON PRECIOS FIJOS ---

    // 1. Definimos las opciones de envío estándar para todo el país.
    const shippingOptions = [
        {
            name: 'Correo Argentino - Envío a Sucursal',
            cost: 7500,
            id: 'sucursal'
        },
        {
            name: 'Correo Argentino - Envío a Domicilio',
            cost: 9500,
            id: 'domicilio'
        }
    ];

    // 2. Definimos los códigos postales de Rosario.
    const rosarioPostalCodes = ['2000', 'S2000', 'S2001', 'S2002', 'S2003', 'S2004', 'S2005', 'S2006', 'S2007', 'S2008', 'S2009', 'S2010', 'S2011', 'S2012', 'S2013'];

    // 3. Verificamos si el código postal pertenece a Rosario.
    if (rosarioPostalCodes.includes(postalCode.trim().toUpperCase())) {
        // Si es de Rosario, AÑADIMOS la opción de Cadete AL PRINCIPIO de la lista.
        shippingOptions.unshift({
            name: 'Cadete (Solo Rosario)',
            cost: 3500,
            id: 'cadete'
        });
    }

    // 4. Enviamos la lista de opciones.
    res.json({ options: shippingOptions });
};