import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, RefreshCw, Truck } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ReturnsPolicyPage: React.FC = () => {
  const contentRef = useScrollAnimation<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div ref={contentRef} className="container mx-auto max-w-4xl px-4 scroll-animate">
        <Link
          to="/tienda"
          className="inline-flex items-center text-gray-600 hover:text-[#D8A7B1] mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Volver a la tienda
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="text-center mb-12">
            <Package className="mx-auto text-[#D8A7B1] mb-4" size={48} />
            <h1 className="text-4xl md:text-5xl font-black text-brand-primary-text tracking-tighter">
              Envíos y Devoluciones
            </h1>
            <p className="mt-4 text-lg text-brand-secondary-text">
              Información clara para que compres con total confianza.
            </p>
          </div>

          <div className="space-y-10">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-brand-pink/20 p-3 rounded-full">
                <RefreshCw className="text-brand-pink" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">Cambios</h2>
                <p className="text-brand-secondary-text mb-4">
                  ¿El talle no fue el correcto? No te preocupes, lo solucionamos.
                </p>
                <ul className="list-disc list-inside space-y-2 text-brand-primary-text">
                  <li>Puedes solicitar un cambio hasta <strong>10 días</strong> después de recibir tu compra.</li>
                  <li>El producto debe estar en las mismas condiciones en que lo recibiste: sin uso y con sus etiquetas.</li>
                  <li>El costo de envío para el cambio corre por cuenta del cliente.</li>
                  <li>Para iniciar el proceso, contáctanos por WhatsApp con tu número de orden.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-brand-pink/20 p-3 rounded-full">
                <Truck className="text-brand-pink" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">Envíos</h2>
                <p className="text-brand-secondary-text mb-4">
                  Llegamos a cada rincón de Argentina.
                </p>
                <ul className="list-disc list-inside space-y-2 text-brand-primary-text">
                  <li>Despachamos los pedidos de <strong>4 a 7 días hábiles</strong> luego de acreditado el pago.</li>
                  <li>El costo de envío se calcula automáticamente en el checkout con tu código postal.</li>
                  <li>Una vez despachado, recibirás un código de seguimiento por mail para ver el estado de tu pedido.</li>
                  <li>Los envíos se realizan a través de Correo Argentino.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicyPage;