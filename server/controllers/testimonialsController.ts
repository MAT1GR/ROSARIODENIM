import { Request, Response } from 'express';

const testimonials = [
  {
    id: 1,
    customerName: '@ornellamagi',
    content: 'Holis, ya retiré las cositas. Enamorada del jean realmente 🙏🏻',
    rating: 5,
    productName: ""
  },
  {
    id: 2,
    customerName: '@celia24cmc',
    content: 'Gracias bella! Me encanto el jean blanco 😍',
    rating: 5,
    productName: ""
  },
  {
    id: 3,
    customerName: 'Leimai V.',
    productName: 'Jean Skinny "eclipse"',
    rating: 5,
    content: '¡Increíble! El mejor jean que he tenido. Se adapta perfecto y el diseño es único.',
  },
];

export const getTestimonials = (req: Request, res: Response) => {
  try {
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: 'Error al obtener los testimonios' });
  }
};
