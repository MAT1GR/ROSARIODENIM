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
    customerName: 'Valentina G.',
    content: 'La curaduría que tienen es espectacular. Siempre encuentro joyitas que no se ven en otro lado.',
    rating: 5,
    productName: 'Jean Mom Clásico'
  },
  {
    id: 4,
    customerName: 'Lucia P.',
    productName: 'Jean Mom " небеса"',
    rating: 5,
    content: '¡Me encantó el calce! Súper cómodo y de excelente calidad. ¡Lo recomiendo!',
  },
  {
    id: 5,
    customerName: 'Martina G.',
    productName: 'Jean Cargo "шторм"',
    rating: 5,
    content: 'El cargo es increíble, el color y la tela son geniales. Me llegó rapidísimo.',
  },
  {
    id: 6,
    customerName: 'Sofia R.',
    productName: 'Jean Wide Leg "пустыня"',
    rating: 5,
    content: 'Hacía mucho que buscaba un wide leg de este color. ¡Es perfecto!.',
  },
  {
    id: 7,
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
