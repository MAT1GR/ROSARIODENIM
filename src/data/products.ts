import { Product, Testimonial } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Mom Jean Vintage Blue',
    price: 18900,
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/7691637/pexels-photo-7691637.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'Mom Jeans',
    description: 'Jean mom de tiro alto con efecto vintage. Confeccionado en denim 100% algodón para máxima durabilidad y comodidad.',
    material: '100% Algodón Denim',
    rise: 'Tiro Alto (28cm)',
    fit: 'Calce Mom - Amplio en cadera y piernas',
    sizes: {
      '36': { available: true, stock: 5, measurements: 'Cintura: 70cm, Cadera: 98cm' },
      '38': { available: true, stock: 3, measurements: 'Cintura: 74cm, Cadera: 102cm' },
      '40': { available: true, stock: 7, measurements: 'Cintura: 78cm, Cadera: 106cm' },
      '42': { available: false, stock: 0, measurements: 'Cintura: 82cm, Cadera: 110cm' }
    },
    isNew: true,
    isBestSeller: false
  },
  {
    id: '2',
    name: 'Wide Leg Black Denim',
    price: 21500,
    images: [
      'https://images.pexels.com/photos/7691840/pexels-photo-7691840.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/7691732/pexels-photo-7691732.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'Wide Leg',
    description: 'Jean wide leg en denim negro premium. Piernas amplias desde la cadera, perfecto para looks elegantes y cómodos.',
    material: '98% Algodón, 2% Elastano',
    rise: 'Tiro Medio (25cm)',
    fit: 'Calce Wide - Amplio en toda la pierna',
    sizes: {
      '36': { available: true, stock: 2, measurements: 'Cintura: 70cm, Cadera: 98cm' },
      '38': { available: true, stock: 4, measurements: 'Cintura: 74cm, Cadera: 102cm' },
      '40': { available: true, stock: 1, measurements: 'Cintura: 78cm, Cadera: 106cm' },
      '42': { available: true, stock: 6, measurements: 'Cintura: 82cm, Cadera: 110cm' }
    },
    isNew: false,
    isBestSeller: true
  },
  {
    id: '3',
    name: 'Flare Jean Indigo',
    price: 19900,
    images: [
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/7691836/pexels-photo-7691836.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'Flare',
    description: 'Jean flare clásico en índigo profundo. Ajustado hasta la rodilla y amplio desde ahí hacia abajo.',
    material: '100% Algodón Denim',
    rise: 'Tiro Medio (26cm)',
    fit: 'Calce Flare - Ajustado hasta rodilla, amplio hacia abajo',
    sizes: {
      '36': { available: true, stock: 8, measurements: 'Cintura: 70cm, Cadera: 98cm' },
      '38': { available: true, stock: 5, measurements: 'Cintura: 74cm, Cadera: 102cm' },
      '40': { available: true, stock: 3, measurements: 'Cintura: 78cm, Cadera: 106cm' },
      '42': { available: true, stock: 2, measurements: 'Cintura: 82cm, Cadera: 110cm' }
    },
    isNew: true,
    isBestSeller: true
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    customerName: 'María L.',
    content: 'Finalmente encontré jeans que me quedan perfectos! La guía de talles es súper precisa.',
    rating: 5,
    productName: 'Mom Jean Vintage Blue'
  },
  {
    id: '2',
    customerName: 'Sofía R.',
    content: 'La calidad es increíble y el envío súper rápido. Ya compré 3 pares!',
    rating: 5,
    productName: 'Wide Leg Black Denim'
  },
  {
    id: '3',
    customerName: 'Ana C.',
    content: 'Amo el calce de estos jeans. Son súper cómodos y me hacen sentir genial.',
    rating: 5,
    productName: 'Flare Jean Indigo'
  }
];