import { Request, Response } from 'express';

const testimonials = [
  {
    id: 1,
    customerName: 'Lucia P.',
    productName: 'Jean Mom " небеса"',
    rating: 5,
    content: '¡Me encantó el calce! Súper cómodo y de excelente calidad. ¡Lo recomiendo!',
  },
  {
    id: 2,
    customerName: 'Martina G.',
    productName: 'Jean Cargo "шторм"',
    rating: 5,
    content: 'El cargo es increíble, el color y la tela son geniales. Me llegó rapidísimo.',
  },
  {
    id: 3,
    customerName: 'Sofia R.',
    productName: 'Jean Wide Leg "пустыня"',
    rating: 5,
    content: 'Hacía mucho que buscaba un wide leg de este color. ¡Es perfecto!.',
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
