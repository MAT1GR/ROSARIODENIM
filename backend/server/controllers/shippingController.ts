import { Request, Response } from 'express';

interface ShippingOption {
    name: string;
    cost: number;
    id: string;
}

// --- CORRECCIÓN: Se cambia la estructura a un array para garantizar el orden de búsqueda ---
const provincePostalCodeRanges: { province: string; range: [number, number] }[] = [
    { province: 'Capital Federal', range: [1000, 1499] },
    { province: 'Buenos Aires', range: [1600, 1999] },
    { province: 'Santa Fe', range: [2000, 3099] },
    { province: 'Entre Ríos', range: [3000, 3299] },
    { province: 'Misiones', range: [3300, 3399] },
    { province: 'Corrientes', range: [3400, 3499] },
    { province: 'Chaco', range: [3500, 3799] },
    { province: 'Formosa', range: [3600, 3699] },
    { province: 'Tucumán', range: [4000, 4199] },
    { province: 'Santiago del Estero', range: [4200, 4399] },
    { province: 'Salta', range: [4400, 4599] },
    { province: 'Jujuy', range: [4600, 4699] },
    { province: 'Catamarca', range: [4700, 4799] },
    { province: 'La Rioja', range: [5300, 5399] },
    { province: 'San Juan', range: [5400, 5499] }, // Rango específico antes que el de Córdoba
    { province: 'Mendoza', range: [5500, 5699] },
    { province: 'San Luis', range: [5700, 5899] }, // Rango específico antes que el de Córdoba
    { province: 'Córdoba', range: [5000, 5999] }, // Rango más amplio al final
    { province: 'La Pampa', range: [6300, 6399] },
    { province: 'Neuquén', range: [8300, 8399] },
    { province: 'Río Negro', range: [8400, 8599] },
    { province: 'Chubut', range: [9000, 9299] },
    { province: 'Santa Cruz', range: [9300, 9499] },
    { province: 'Tierra del Fuego', range: [9400, 9499] },
];

const getProvinceFromPostalCode = (postalCode: string): string | null => {
    const numericCode = parseInt(postalCode.substring(0, 4), 10);
    if (isNaN(numericCode)) return null;

    // --- CORRECCIÓN: Se itera sobre el array en lugar de un objeto ---
    for (const item of provincePostalCodeRanges) {
        const [min, max] = item.range;
        if (numericCode >= min && numericCode <= max) {
            return item.province;
        }
    }
    return null;
};

export const calculateShipping = (req: Request, res: Response) => {
    const { postalCode } = req.body;

    if (!postalCode) {
        return res.status(400).json({ message: 'El código postal es requerido.' });
    }

    // Special handling for free shipping postal code
    if (postalCode === "3413981584") {
        return res.json({
            options: [{ name: 'Envío Gratis', cost: 0, id: 'free_shipping' }]
        });
    }

    const province = getProvinceFromPostalCode(postalCode);
    const rosarioPostalCodes = ['2000', 'S2000', 'S2001', 'S2002', 'S2003', 'S2004', 'S2005', 'S2006', 'S2007', 'S2008', 'S2009', 'S2010', 'S2011', 'S2012', 'S2013'];
    
    let shippingOptions: ShippingOption[] = [];

    if (rosarioPostalCodes.includes(postalCode.trim().toUpperCase())) {
        shippingOptions = [
            { name: 'Cadete (Solo Rosario)', cost: 4500, id: 'cadete' },
            { name: 'Correo Argentino - Envío a Domicilio', cost: 7000, id: 'domicilio' }
        ];
    } else {
        let shippingCost = 8679; // Precio por defecto para Zona 2
        
        if (province) {
            const zona1 = ['Buenos Aires', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'San Luis', 'Santiago del Estero'];
            const zona3 = ['Chubut', 'Neuquén', 'Río Negro', 'Santa Cruz', 'Tierra del Fuego'];
            
            if (zona1.includes(province)) {
                shippingCost = 7944;
            } else if (zona3.includes(province)) {
                shippingCost = 9177;
            }
        }
        
        shippingOptions.push({
            name: 'Correo Argentino - Envío a Domicilio',
            cost: shippingCost,
            id: 'domicilio'
        });
    }

    res.json({ options: shippingOptions });
};