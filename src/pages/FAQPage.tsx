import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import Accordion from '../components/Accordion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const FAQPage: React.FC = () => {
  const contentRef = useScrollAnimation<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div ref={contentRef} className="container mx-auto max-w-3xl px-4 scroll-animate">
        <Link
          to="/tienda"
          className="inline-flex items-center text-gray-600 hover:text-[#D8A7B1] mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Volver a la tienda
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="text-center mb-12">
            <HelpCircle className="mx-auto text-[#D8A7B1] mb-4" size={48} />
            <h1 className="text-4xl md:text-5xl font-black text-brand-primary-text tracking-tighter">
              Preguntas Frecuentes
            </h1>
            <p className="mt-4 text-lg text-brand-secondary-text">
              Respuestas claras y directas. Sin letra pequeña.
            </p>
          </div>

          <div className="space-y-4">
            <Accordion title="¿Cómo sé cuál es mi talle?">
              <p>Es la pregunta más importante. Creamos una <Link to="/tallas" className="text-[#D8A7B1] font-semibold hover:underline">Guía de Tallas</Link> súper detallada. La clave es que midas un jean que ya tengas y te quede bien, y compares esas medidas con nuestra tabla. Medimos cada jean a mano para garantizar precisión.</p>
            </Accordion>
            <Accordion title="¿Qué pasa si el jean no me queda como esperaba?">
              <p>No hay problema. Aceptamos cambios dentro de los 10 días de recibido el producto. El jean debe estar en las mismas condiciones en que lo recibiste. Contáctanos por WhatsApp y coordinamos el cambio de la forma más simple posible.</p>
            </Accordion>
            <Accordion title="¿Cuánto tarda y cuesta el envío?">
              <p>Despachamos los pedidos de 4 a 7 días hábiles después de confirmado el pago. El costo de envío y el tiempo de entrega final dependen de tu código postal. Puedes calcular el costo exacto en la página de cada producto antes de comprar.</p>
            </Accordion>
            <Accordion title="¿Los jeans son nuevos o usados?">
              <p>Todos nuestros jeans son prendas vintage seleccionadas, lo que significa que son de segunda mano pero se encuentran en excelente estado. Cada jean es una pieza única de décadas pasadas, curada y lista para una nueva vida. No vendemos ropa nueva de fábrica.</p>
            </Accordion>
             <Accordion title="¿Qué métodos de pago aceptan?">
              <p>Aceptamos todos los métodos de pago a través de Mercado Pago, incluyendo tarjetas de crédito, débito y dinero en cuenta. Tu compra está 100% protegida por su programa de Compra Protegida.</p>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;