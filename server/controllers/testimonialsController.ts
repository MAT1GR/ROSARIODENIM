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
    customerName: '@alaniisleo',
    content: 'Gracias bella! Me encanto el jean blanco 😍',
    rating: 5,
    productName: ""
  },
  {
    id: 3,
    customerName: '@_leimai',
    content: 'Es el mejor jean que tengo, MUCHAS GRACIASSS',
    rating: 5,
    productName: ""
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
